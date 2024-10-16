import type { IGrammar } from "vscode-textmate";
import { Token } from "./annotations";
import { highlightText, highlightTokens } from "./highlighter";
import { CodeRange, parseRelativeRanges } from "./range";
import { FinalTheme } from "./theme";
import { blockRegexToRange, inlineRegexToRange } from "./regex-range";

const PUNCTUATION = "#001";
const COMMENT = "#010";
const LINE_COMMENT = "#011";
const BLOCK_COMMENT = "#012";
const commentsTheme: FinalTheme = {
  name: "comments",
  type: "light",
  foreground: "",
  background: "",
  colors: {},
  settings: [
    { settings: { foreground: "#000" } },
    {
      scope: ["punctuation.definition.comment"],
      settings: { foreground: PUNCTUATION },
    },
    { scope: "comment", settings: { foreground: COMMENT } },
    // { scope: "comment.line", settings: { foreground: LINE_COMMENT } },
    // { scope: "comment.block", settings: { foreground: BLOCK_COMMENT } },
  ],
};

export type Annotation = {
  name: string;
  query?: string;
  ranges: CodeRange[];
};

export type AnnotationData = {
  name: string;
  rangeString: string;
  query?: string;
};

type RawAnnotation = AnnotationData & { lineNumber: number };

export type AnnotationExtractor =
  | string[]
  | ((comment: string) => null | AnnotationData);

export function extractCommentsFromCode(
  code: string,
  grammar: IGrammar,
  lang: string,
  annotationExtractor: AnnotationExtractor
) {
  const lines = !grammar
    ? highlightText(code)
    : highlightTokens(code, grammar, commentsTheme);

  const allAnnotations: RawAnnotation[] = [];

  let lineNumber = 1;
  const newCode = lines
    .map((line) => {
      const { annotations, lineWithoutComments } = getAnnotationsFromLine(
        line,
        annotationExtractor,
        lineNumber,
        lang
      );

      allAnnotations.push(...annotations);

      if (!lineWithoutComments) {
        return null;
      }

      const lineText = lineWithoutComments.map((t) => t.content).join("");

      // remove jsx comment wrapper https://github.com/code-hike/lighter/issues/23
      if (
        ["mdx", "jsx", "tsx"].includes(lang) &&
        annotations.length > 0 &&
        lineText.trim() === "{}"
      ) {
        return null;
      }

      lineNumber++;
      return lineText;
    })
    .filter((line) => line !== null)
    .join(`\n`);

  const annotations = allAnnotations
    .map(({ rangeString, lineNumber, ...rest }) => ({
      ...rest,
      ranges: parseRangeString(rangeString, lineNumber, newCode),
    }))
    .filter((a) => a.ranges.length > 0);

  return { newCode, annotations };
}

// these are the langs that dont have a PUNCTUATION token
const prefixes = {
  "actionscript-3": "//",
  ada: "--",
  asm: "#",
  dart: "//",
  fsharp: "//",
  graphql: "#",
  http: "#",
  rust: "//",
  sparql: "#",
  wgsl: "//",
  jsonnet: "//",
  kql: "//",
  zenscript: "//",
  kusto: "//",
  turtle: "#",
  abap: "*",
  beancount: ";",
  kotlin: "//",
  hlsl: "//",
  berry: "#",
  cypher: "//",
  elm: "--",
  nix: "#",
  viml: '"',
  solidity: "//",
  bat: "REM",
  shaderlab: "//",
  sas: "*",
  clarity: ";;",
};

function getAnnotationsFromLine(
  tokens: Token[],
  annotationExtractor: AnnotationExtractor,
  lineNumber: number,
  lang: string
): {
  annotations: RawAnnotation[];
  lineWithoutComments: Token[] | null;
} {
  // convert prefix to PUNCTUATION
  if (
    lang in prefixes &&
    tokens.some((token) => token.style.color === COMMENT)
  ) {
    const prefix = prefixes[lang];
    tokens = tokens.flatMap((token) => {
      if (token.style.color !== COMMENT) {
        return [token];
      }
      const trimmed = token.content.trimStart();
      if (trimmed.startsWith(prefix)) {
        const content = trimmed.slice(prefix.length);
        const punctuation = token.content.slice(
          0,
          token.content.length - content.length
        );
        const t = [
          { content: punctuation, style: { color: PUNCTUATION } },
        ] as Token[];
        if (content.length) {
          t.push({ content, style: token.style });
        }
        return t;
      }
      return [token];
    });
  }

  // if no punctuation return empty
  if (!tokens.some((token) => token.style.color === PUNCTUATION)) {
    return { annotations: [], lineWithoutComments: tokens };
  }

  // first get the annotations without touching the line
  const comments: {
    tokens: Token[];
    name: string;
    query?: string;
    rangeString: string;
    lineNumber: number;
  }[] = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];

    if (token.style.color !== COMMENT) {
      // not a comment
      i++;
      continue;
    }

    const annotationData =
      typeof annotationExtractor === "function"
        ? annotationExtractor(token.content)
        : getAnnotationDataFromNames(token.content, annotationExtractor);

    if (!annotationData) {
      // a comment, but not an annotation
      i++;
      continue;
    }
    const { name, query, rangeString } = annotationData;

    // we have an annotation
    const prevToken = tokens[i - 1];
    const nextToken = tokens[i + 1];
    const commentTokens: Token[] = [];
    if (prevToken && prevToken.style.color === PUNCTUATION) {
      commentTokens.push(prevToken);
    }
    commentTokens.push(token);
    if (nextToken && nextToken.style.color === PUNCTUATION) {
      commentTokens.push(nextToken);
    }

    comments.push({
      tokens: commentTokens,
      name,
      query,
      rangeString,
      lineNumber,
    });

    i += 2;
  }

  // remove the comments from the line
  let newLine = tokens;
  for (const comment of comments) {
    newLine = newLine.filter((token) => !comment.tokens.includes(token));
  }

  // if the newLine is whitespace, set it to null
  if (newLine.every((token) => token.content.trim() === "")) {
    newLine = null;
  }

  return {
    annotations: comments.map((a) => ({
      name: a.name,
      query: a.query,
      lineNumber: a.lineNumber,
      rangeString: a.rangeString,
    })),
    lineWithoutComments: newLine,
  };
}

function parseRangeString(
  rangeString: string,
  lineNumber: number,
  code: string
) {
  if (rangeString && rangeString.startsWith("(/")) {
    return blockRegexToRange(code, rangeString, lineNumber);
  } else if (rangeString && rangeString.startsWith("[/")) {
    return inlineRegexToRange(code, rangeString, lineNumber);
  }
  return parseRelativeRanges(rangeString, lineNumber);
}

function getAnnotationDataFromNames(content: string, names: string[]) {
  const regex = /\s*([\w-]+)?(\([^\)]*\)|\[[^\]]*\])?(.*)$/;
  const match = content.match(regex);
  const name = match[1];
  const rangeString = match[2];
  const query = match[3]?.trim();

  if (!names.includes(name)) {
    return null;
  }

  return { name, rangeString, query };
}
