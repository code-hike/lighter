import type { IGrammar } from "vscode-textmate";
import { Token } from "./annotations";
import { highlightText, highlightTokens } from "./highlighter";
import { CodeRange, parseRelativeRanges } from "./range";
import { FinalTheme } from "./theme";

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

  const allAnnotations: Annotation[] = [];

  let lineNumber = 1;
  const newCode = lines
    .map((line) => {
      const { annotations, lineWithoutComments } = getAnnotationsFromLine(
        line,
        annotationExtractor,
        lineNumber
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

  return { newCode, annotations: allAnnotations };
}

function getAnnotationsFromLine(
  tokens: Token[],
  annotationExtractor: AnnotationExtractor,
  lineNumber: number
) {
  // if no punctuation return empty
  if (!tokens.some((token) => token.style.color === PUNCTUATION)) {
    return { annotations: [], lineWithoutComments: tokens };
  }

  // first get the annotations without touching the line
  const comments: {
    tokens: Token[];
    name: string;
    query?: string;
    ranges: CodeRange[];
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
      ranges: parseRelativeRanges(rangeString, lineNumber),
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
      ranges: a.ranges,
    })),
    lineWithoutComments: newLine,
  };
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
