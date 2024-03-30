import { CodeRange, InlineRange, MultiLineRange } from "./range";

// parse "(/foo/i)" into an array of ranges
export function blockRegexToRange(
  code: string,
  regexString: string,
  lineNumber: number
): MultiLineRange[] {
  const inputMatch = regexString.match(/\(\/([\s\S]*?)\/([gimuy]*)\)/);
  if (!inputMatch) throw new Error(`Invalid RegExp string: ${regexString}`);
  const regex = new RegExp(inputMatch[1], inputMatch[2]);

  let lines = code.split(/\r?\n/).slice(lineNumber - 1);
  const remainingCode = lines.join("\n");

  if (!regex.global) {
    const match = regex.exec(remainingCode);
    if (!match) return [];
    const fromLineNumber =
      remainingCode.slice(0, match.index).split("\n").length + lineNumber - 1;
    const toLineNumber = fromLineNumber + match[0].split("\n").length - 1;
    return [{ fromLineNumber, toLineNumber }];
  }

  let match;
  const results: MultiLineRange[] = [];
  while ((match = regex.exec(remainingCode))) {
    const fromLineNumber =
      remainingCode.slice(0, match.index).split("\n").length + lineNumber - 1;
    const toLineNumber = fromLineNumber + match[0].split("\n").length - 1;

    const lastResult = results[results.length - 1];
    if (!lastResult || lastResult.fromLineNumber !== fromLineNumber) {
      // only push when it's a new range
      results.push({ fromLineNumber, toLineNumber });
    }
  }

  return results;
}

export function inlineRegexToRange(
  code: string,
  regexString: string,
  lineNumber: number
): InlineRange[] {
  const inputMatch = regexString.match(/\[\/([\s\S]*?)\/([gimuy]*)\]/);
  if (!inputMatch) throw new Error(`Invalid RegExp string: ${regexString}`);
  let flags = inputMatch[2] || "";
  flags += "d";
  const regex = new RegExp(inputMatch[1], flags);
  let lines = code.split(/\r?\n/);
  lines = lines.slice(lineNumber - 1);

  // if the regex is not multiline (`m` flag), only use the first line
  if (!regex.multiline) lines = [lines[0]];

  const ranges: InlineRange[] = [];

  lines.forEach((line, i) => {
    if (!regex.global) {
      if (ranges.length > 0) return;
      const match = regex.exec(line) as any;
      if (!match) return;
      // if there are capture groups, use indices[1] else use indices[0]
      const indices = match.indices[1] || match.indices[0];
      ranges.push({
        lineNumber: i + lineNumber,
        fromColumn: indices[0] + 1,
        toColumn: indices[1],
      });
      return;
    }

    let match;
    while ((match = regex.exec(line))) {
      // if there are capture groups, use indices[1] else use indices[0]
      const indices = match.indices[1] || match.indices[0];
      ranges.push({
        lineNumber: i + lineNumber,
        fromColumn: indices[0] + 1,
        toColumn: indices[1],
      });
    }
  });
  return ranges;
}
