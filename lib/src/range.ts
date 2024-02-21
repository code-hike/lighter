type LineNumber = number;
type ColumnNumber = number;

export type RangeString = string | undefined;

export type MultiLineRange = {
  fromLineNumber: LineNumber;
  toLineNumber: LineNumber;
};
export type InlineRange = {
  lineNumber: LineNumber;
  fromColumn: ColumnNumber;
  toColumn: ColumnNumber;
};
export type CodeRange = MultiLineRange | InlineRange;

export function parseRelativeRanges(
  relativeRange: RangeString,
  lineNumber: LineNumber
): CodeRange[] {
  if (!relativeRange) {
    return [{ fromLineNumber: lineNumber, toLineNumber: lineNumber }];
  }

  if (relativeRange.startsWith("[")) {
    return getInlineRanges(relativeRange, lineNumber);
  }

  const parts = splitParts(relativeRange.slice(1, -1));
  return parts
    .map((part) => {
      // if the part has columns
      if (part.includes("[")) {
        const [lineString, columnSplit] = part.split("[");
        const relativeLineNumber = Number(lineString);
        const globalLineNumber = lineNumber + relativeLineNumber - 1;
        if (!isNaturalNumber(globalLineNumber)) {
          throw new RangeNumberError(lineString);
        }
        return getInlineRanges("[" + columnSplit, globalLineNumber);
      }
      // if no columns
      const { from, to } = partToExtremes(part);
      return [
        {
          fromLineNumber: from + lineNumber - 1,
          toLineNumber: to + lineNumber - 1,
        },
      ];
    })
    .flat();
}

// parse "[1,2:3,4]" into an array of ranges
function getInlineRanges(
  columnRangeString: string,
  lineNumber: number
): InlineRange[] {
  const parts = splitParts(columnRangeString.slice(1, -1));
  return parts.map((part) => {
    const { from, to } = partToExtremes(part);
    return { lineNumber, fromColumn: from, toColumn: to };
  });
}

function partToExtremes(part: string) {
  // Transforms something like
  // - "1:3" to {from:1, to: 3}
  // - "4" to {from:4, to:4}
  const [start, end] = part.split(":");

  if (!isNaturalNumber(start)) {
    throw new RangeNumberError(start);
  }

  const from = Number(start);

  if (from < 1) {
    throw new LineOrColumnNumberError();
  }

  if (!end) {
    return { from, to: from };
  } else {
    if (!isNaturalNumber(end)) {
      throw new RangeNumberError(end);
    }
    return { from, to: +end };
  }
}

// split a string like "1,3[4:5,6],7:8" into ["1", "3[4:5,6]", "7:8"]
function splitParts(rangeString: string) {
  return rangeString.split(/,(?![^\[]*\])/g);
}

function isNaturalNumber(n: any) {
  n = n.toString(); // force the value in case it is not
  var n1 = Math.abs(n),
    n2 = parseInt(n, 10);
  return !isNaN(n1) && n2 === n1 && n1.toString() === n;
}

class RangeNumberError extends Error {
  number: string;
  constructor(number: string) {
    super(`Invalid number "${number}" in range string`);
    this.number = number;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
class LineOrColumnNumberError extends Error {
  constructor() {
    super(`Invalid line or column number in range string`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
