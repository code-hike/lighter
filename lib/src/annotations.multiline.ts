import { Line, LineGroup, Lines, MultilineAnnotation } from "./annotations";

type LineWrapper = {
  fromLineNumber: number;
  toLineNumber: number;
  line: Line;
};

type FakeLineGroup = {
  annotationName: string;
  annotationQuery?: string;
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
      annotationQuery: group.annotationQuery,
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
  const { range, name, query } = annotation;
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
    annotationQuery: query,
    fromLineNumber,
    toLineNumber,
    lines: [],
  };

  const firstGroup = annotatedLines[i];
  if (firstGroup.fromLineNumber < fromLineNumber) {
    const [firstHalf, secondHalf] = splitGroup(firstGroup, fromLineNumber);
    newAnnotatedLines.push(firstHalf);
    newAnnotatedLines.push(newGroup);

    if (secondHalf.toLineNumber > toLineNumber) {
      const [secondFirstHalf, secondSecondHalf] = splitGroup(
        secondHalf,
        toLineNumber + 1
      );
      newGroup.lines.push(secondFirstHalf);
      newAnnotatedLines.push(secondSecondHalf);
    } else {
      newGroup.lines.push(secondHalf);
    }
    i++;
  } else {
    newAnnotatedLines.push(newGroup);
  }

  while (
    i < annotatedLines.length &&
    annotatedLines[i].toLineNumber <= toLineNumber
  ) {
    newGroup.lines.push(annotatedLines[i]);
    i++;
  }

  if (i === annotatedLines.length) {
    return newAnnotatedLines;
  }

  const lastGroup = annotatedLines[i];
  if (lastGroup.fromLineNumber <= toLineNumber) {
    const [firstHalf, secondHalf] = splitGroup(lastGroup, toLineNumber + 1);
    newGroup.lines.push(firstHalf);
    newAnnotatedLines.push(secondHalf);
    i++;
  }

  while (i < annotatedLines.length) {
    newAnnotatedLines.push(annotatedLines[i]);
    i++;
  }

  return newAnnotatedLines;
}

function splitGroup<G extends LineWrapper | FakeLineGroup>(
  group: G,
  lineNumber: number
): [G, G] {
  if ("line" in group) {
    return [
      {
        ...group,
        toLineNumber: lineNumber - 1,
      },
      {
        ...group,
        fromLineNumber: lineNumber,
      },
    ];
  } else {
    const firstLines = [];
    const secondLines = [];

    group.lines.forEach((line) => {
      if (line.toLineNumber < lineNumber) {
        firstLines.push(line);
      } else if (line.fromLineNumber >= lineNumber) {
        secondLines.push(line);
      } else {
        const [firstLine, secondLine] = splitGroup(line, lineNumber);
        firstLines.push(firstLine);
        secondLines.push(secondLine);
      }
    });

    return [
      {
        ...group,
        toLineNumber: lineNumber - 1,
        lines: firstLines,
      },
      {
        ...group,
        fromLineNumber: lineNumber,
        lines: secondLines,
      },
    ];
  }
}
