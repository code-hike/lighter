import { InlineAnnotation, Token, TokenGroup } from "./annotations";

type TokenWrapper = {
  fromColumn: number;
  toColumn: number;
  token: Token;
};

type FakeTokenGroup = {
  annotationName: string;
  fromColumn: number;
  toColumn: number;
  tokens: (TokenWrapper | FakeTokenGroup)[];
};

export function annotateLine(line: Token[], annotations: InlineAnnotation[]) {
  let annotatedLine: (TokenWrapper | FakeTokenGroup)[] = [];
  let columnNumber = 1;
  line.forEach((token) => {
    annotatedLine.push({
      fromColumn: columnNumber,
      toColumn: columnNumber + token.content.length - 1,
      token,
    });
  });

  annotations.forEach((annotation) => {
    annotatedLine = reannotateLine(annotatedLine, annotation);
  });

  // remove the fake groups
  return annotatedLine.map((group) => removeFakeGroups(group));
}

function removeFakeGroups(
  group: TokenWrapper | FakeTokenGroup
): Token | TokenGroup {
  if ("tokens" in group) {
    return {
      annotationName: group.annotationName,
      fromColumn: group.fromColumn,
      toColumn: group.toColumn,
      tokens: group.tokens.map((group) => removeFakeGroups(group)),
    };
  } else {
    return group.token;
  }
}

function reannotateLine(
  annotatedLine: (TokenWrapper | FakeTokenGroup)[],
  annotation: InlineAnnotation
) {
  const { range, name, ...rest } = annotation;
  const { fromColumn, toColumn } = range;
  const newAnnotatedLine: (TokenWrapper | FakeTokenGroup)[] = [];

  let i = 0;
  while (i < annotatedLine.length && annotatedLine[i].toColumn < fromColumn) {
    newAnnotatedLine.push(annotatedLine[i]);
    i++;
  }

  if (i === annotatedLine.length) {
    return annotatedLine;
  }

  const newGroup: FakeTokenGroup = {
    annotationName: annotation.name,
    fromColumn,
    toColumn,
    tokens: [],
  };
  const firstGroup = annotatedLine[i];
  if (firstGroup.fromColumn < fromColumn) {
    // we need to split the first group in two
    newGroup.tokens.push({
      ...firstGroup,
      toColumn: fromColumn - 1,
    });
    newGroup.tokens.push({
      ...firstGroup,
      fromColumn,
    });
    i++;
  }

  while (i < annotatedLine.length && annotatedLine[i].toColumn < toColumn) {
    newGroup.tokens.push(annotatedLine[i]);
    i++;
  }

  newAnnotatedLine.push(newGroup);

  if (i === annotatedLine.length) {
    return newAnnotatedLine;
  }

  const lastGroup = annotatedLine[i];
  if (lastGroup.toColumn > toColumn) {
    // we need to split the last group in two
    newGroup.tokens.push({
      ...lastGroup,
      toColumn,
    });
    newGroup.tokens.push({
      ...lastGroup,
      fromColumn: toColumn + 1,
    });
    i++;
  }

  while (i < annotatedLine.length) {
    newAnnotatedLine.push(annotatedLine[i]);
    i++;
  }

  return newAnnotatedLine;
}
