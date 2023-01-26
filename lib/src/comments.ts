import { IGrammar } from "vscode-textmate";
import { Token } from "./annotations";
import { highlightTokens } from "./highlighter";
import { CodeRange, parseRelativeRanges } from "./range";
import { FinalTheme } from "./theme";

const PUNCTUATION = "#001";
const COMMENT = "#010";
const LINE_COMMENT = "#011";
const BLOCK_COMMENT = "#012";
const commentsTheme: FinalTheme = {
  name: "comments",
  type: "light",
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

export function extractCommentsFromCode(
  code: string,
  grammar: IGrammar,
  annotationNames: string[]
) {
  const lines = highlightTokens(code, grammar, commentsTheme);

  const allAnnotations: Annotation[] = [];

  let lineNumber = 1;
  const cleanLines = lines
    .map((line) => {
      const { annotations, lineWithoutComments } = getAnnotationsFromLine(
        line,
        annotationNames,
        lineNumber
      );

      allAnnotations.push(...annotations);

      return lineWithoutComments;
    })
    .filter((line) => line !== null);

  const newCode = cleanLines
    .map((line) => line.map((t) => t.content).join(""))
    .join(`\n`);

  return { newCode, annotations: allAnnotations };
}

function getAnnotationsFromLine(
  tokens: Token[],
  names: string[],
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

    const { name, query, rangeString } = getAnnotationData(token.content);
    if (!names.includes(name)) {
      // a comment, but not an annotation
      i++;
      continue;
    }

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

function getAnnotationData(content: string) {
  const regex = /\s*([\w-]+)?(\([^\)]*\)|\[[^\]]*\])?(.*)$/;
  const match = content.match(regex);
  const name = match[1];
  const rangeString = match[2];
  const query = match[3]?.trim();
  return { name, rangeString, query };
}
