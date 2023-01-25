import { Line, LineGroup, Lines, MultilineAnnotation } from "./annotations";

type LineWrapper = {
  fromLineNumber: number;
  toLineNumber: number;
  line: Line;
};

type FakeLineGroup = {
  annotationName: string;
  fromLineNumber: number;
  toLineNumber: number;
  lines: (LineWrapper | FakeLineGroup)[];
};

export function annotateLines(
  lines: Line[],
  annotations: MultilineAnnotation[]
): Lines {
  let annotatedLines: (LineWrapper | FakeLineGroup)[] = lines.map(
    (line, lineIndex) => ({
      fromLineNumber: lineIndex + 1,
      toLineNumber: lineIndex + 1,
      line,
    })
  );

  annotations.forEach((annotation) => {
    annotatedLines = reannotateLines(annotatedLines, annotation);
  });

  return annotatedLines.map((group) => removeFakeGroups(group));
}

function removeFakeGroups(
  group: LineWrapper | FakeLineGroup
): Line | LineGroup {
  if ("line" in group) {
    return {
      lineNumber: group.fromLineNumber,
      tokens: group.line.tokens,
    };
  } else {
    return {
      annotationName: group.annotationName,
      fromLineNumber: group.fromLineNumber,
      toLineNumber: group.toLineNumber,
      lines: group.lines.map((line) => removeFakeGroups(line)),
    };
  }
}

function reannotateLines(
  annotatedLines: (LineWrapper | FakeLineGroup)[],
  annotation: MultilineAnnotation
) {
  const { range, name, ...rest } = annotation;
  const { fromLineNumber, toLineNumber } = range;
  const newAnnotatedLines: (LineWrapper | FakeLineGroup)[] = [];

  let i = 0;
  while (
    i < annotatedLines.length &&
    annotatedLines[i].toLineNumber < fromLineNumber
  ) {
    newAnnotatedLines.push(annotatedLines[i]);
    i++;
  }

  if (i === annotatedLines.length) {
    return newAnnotatedLines;
  }

  const newGroup: FakeLineGroup = {
    annotationName: name,
    fromLineNumber,
    toLineNumber,
    lines: [],
  };

  const firstGroup = annotatedLines[i];
  if (firstGroup.fromLineNumber < fromLineNumber) {
    newGroup.lines.push({
      ...firstGroup,
      toLineNumber: fromLineNumber - 1,
    });
    newGroup.lines.push({
      ...firstGroup,
      fromLineNumber,
    });
    i++;
  }

  while (
    i < annotatedLines.length &&
    annotatedLines[i].toLineNumber <= toLineNumber
  ) {
    newGroup.lines.push(annotatedLines[i]);
    i++;
  }

  newAnnotatedLines.push(newGroup);

  if (i === annotatedLines.length) {
    return newAnnotatedLines;
  }

  const lastGroup = annotatedLines[i];
  if (lastGroup.toLineNumber > toLineNumber) {
    newAnnotatedLines.push({
      ...lastGroup,
      toLineNumber,
    });
    newAnnotatedLines.push({
      ...lastGroup,
      fromLineNumber: toLineNumber + 1,
    });
    i++;
  }

  while (i < annotatedLines.length) {
    newAnnotatedLines.push(annotatedLines[i]);
    i++;
  }

  return newAnnotatedLines;
}
