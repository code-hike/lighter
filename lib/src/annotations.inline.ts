import { InlineAnnotation, Token, TokenGroup } from "./annotations";

type TokenWrapper = {
  fromColumn: number;
  toColumn: number;
  token: Token;
};

type FakeTokenGroup = {
  annotationName: string;
  annotationQuery?: string;
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
    columnNumber += token.content.length;
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
      annotationQuery: group.annotationQuery,
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
  const { range } = annotation;
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
    annotationQuery: annotation.query,
    fromColumn,
    toColumn,
    tokens: [],
  };
  const firstGroup = annotatedLine[i];
  if (firstGroup.fromColumn < fromColumn) {
    // we need to split the first group in two

    const [firstHalf, secondHalf] = splitGroup(firstGroup, fromColumn);

    newAnnotatedLine.push(firstHalf);
    newGroup.tokens.push(secondHalf);
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
  if (lastGroup.fromColumn <= toColumn) {
    // we need to split the last group in two

    const [firstHalf, secondHalf] = splitGroup(lastGroup, toColumn + 1);

    newGroup.tokens.push(firstHalf);
    newAnnotatedLine.push(secondHalf);
    i++;
  }

  while (i < annotatedLine.length) {
    newAnnotatedLine.push(annotatedLine[i]);
    i++;
  }

  return newAnnotatedLine;
}

function splitGroup<G extends TokenWrapper | FakeTokenGroup>(
  group: G,
  column: number
): [G, G] {
  if ("token" in group) {
    const firstToken = {
      ...group.token,
      content: group.token.content.slice(0, column - group.fromColumn),
    };
    const secondToken = {
      ...group.token,
      content: group.token.content.slice(column - group.fromColumn),
    };
    const firstGroup = {
      ...group,
      toColumn: column - 1,
      token: firstToken,
    };
    const secondGroup = {
      ...group,
      fromColumn: column,
      token: secondToken,
    };
    return [firstGroup, secondGroup];
  } else {
    const firstTokens = [];
    const secondTokens = [];

    group.tokens.forEach((token) => {
      if (token.toColumn < column) {
        firstTokens.push(token);
      } else if (token.fromColumn >= column) {
        secondTokens.push(token);
      } else {
        const [firstGroup, secondGroup] = splitGroup(token, column);
        firstTokens.push(firstGroup);
        secondTokens.push(secondGroup);
      }
    });

    const firstGroup = {
      ...group,
      toColumn: column - 1,
      tokens: firstTokens,
    };
    const secondGroup = {
      ...group,
      fromColumn: column,
      tokens: secondTokens,
    };
    return [firstGroup, secondGroup];
  }
}
