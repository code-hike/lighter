import { annotateLine } from "./annotations.inline";
import { annotateLines } from "./annotations.multiline";
import { Annotation } from "./comments";
import { InlineRange, MultiLineRange } from "./range";

export type Token = {
  content: string;
  style: {
    color?: string;
    fontStyle?: "italic";
    fontWeight?: "bold";
    textDecoration?: "underline" | "line-through";
  };
  scopes?: string[];
};

export type TokenGroup = {
  annotationName: string;
  annotationQuery?: string;
  fromColumn: number;
  toColumn: number;
  tokens: Tokens;
};

export type Tokens = (Token | TokenGroup)[];

export type Line = { lineNumber: number; tokens: Tokens };
export type LineGroup = {
  annotationName: string;
  annotationQuery?: string;
  fromLineNumber: number;
  toLineNumber: number;
  lines: Lines;
};
export type Lines = (Line | LineGroup)[];

export function applyAnnotations(lines: Token[][], annotations: Annotation[]) {
  const { inlineAnnotations, multilineAnnotations } =
    splitAnnotations(annotations);

  let annotatedLines = lines.map((line, lineIndex) => {
    const lineAnnotations = inlineAnnotations.filter(
      (annotation) => annotation.range.lineNumber === lineIndex + 1
    );
    return {
      lineNumber: lineIndex + 1,
      tokens: annotateLine(line, lineAnnotations),
    } as Line;
  });

  return annotateLines(annotatedLines, multilineAnnotations);
}

export type InlineAnnotation = Omit<Annotation, "ranges"> & {
  range: InlineRange;
};

export type MultilineAnnotation = Omit<Annotation, "ranges"> & {
  range: MultiLineRange;
};

function splitAnnotations(annotations: Annotation[]) {
  const inlineAnnotations: InlineAnnotation[] = [];
  const multilineAnnotations: MultilineAnnotation[] = [];

  annotations.forEach((annotation) => {
    annotation.ranges.forEach((range) => {
      if ("lineNumber" in range) {
        inlineAnnotations.push({ ...annotation, range });
      } else {
        multilineAnnotations.push({ ...annotation, range });
      }
    });
  });

  return {
    inlineAnnotations,
    multilineAnnotations,
  };
}
