// import { MetadataConsts, FontStyle } from "vscode-textmate";

import { IGrammar, StackElement } from "vscode-textmate";
import { Line, Token } from "./annotations";

// MetadataConsts
const FONT_STYLE_MASK = 0b00000000000000000111100000000000;
const FOREGROUND_MASK = 0b00000000111111111000000000000000;
const BACKGROUND_MASK = 0b11111111000000000000000000000000;
const FONT_STYLE_OFFSET = 11;
const FOREGROUND_OFFSET = 15;
const BACKGROUND_OFFSET = 24;

const FontStyle = {
  NotSet: -1,
  None: 0,
  Italic: 1,
  Bold: 2,
  Underline: 4,
  Strikethrough: 8,
};

export function tokenize(code: string, grammar: IGrammar, colors: string[]) {
  let stack: StackElement | null = null;
  const lines = code.split(/\r?\n|\r/g);
  return lines.map((line) => {
    const { tokens, ruleStack } = grammar.tokenizeLine2(line, stack);
    const newTokens: Token[] = [];
    let tokenEnd = line.length;
    for (let i = tokens.length - 2; i >= 0; i = i - 2) {
      const tokenStart = tokens[i];
      const metadata = tokens[i + 1];
      newTokens.unshift({
        content: line.slice(tokenStart, tokenEnd),
        style: getStyle(metadata, colors),
      });
      tokenEnd = tokenStart;
    }
    stack = ruleStack;
    return newTokens;
  });
}

// export function tokenizeWithScopes(code: string, grammar: IGrammar) {
//   let stack: StackElement | null = null;
//   const lines = code.split(/\r?\n|\r/g);
//   return lines.map((line) => {
//     const { tokens, ruleStack } = grammar.tokenizeLine(line, stack);
//     const newTokens: { content: string; scopes: string }[] = [];

//     for (let i = 0; i < tokens.length; i++) {
//       const { startIndex, endIndex, scopes } = tokens[i];
//       newTokens.push({
//         content: line.slice(startIndex, endIndex),
//         scopes: scopes.join(" "),
//       });
//     }
//     stack = ruleStack;
//     return newTokens;
//   });
// }

function getStyle(metadata: number, colors: string[]): Token["style"] {
  const fg = (metadata & FOREGROUND_MASK) >>> FOREGROUND_OFFSET;
  // const bg = (metadata & BACKGROUND_MASK) >>> BACKGROUND_OFFSET;
  const style = {
    color: colors[fg],
    // backgroundColor: colors[bg],
  };
  const fs = (metadata & FONT_STYLE_MASK) >>> FONT_STYLE_OFFSET;
  if (fs & FontStyle.Italic) {
    style["fontStyle"] = "italic";
  }
  if (fs & FontStyle.Bold) {
    style["fontWeight"] = "bold";
  }
  if (fs & FontStyle.Underline) {
    style["textDecoration"] = "underline";
  }
  if (fs & FontStyle.Strikethrough) {
    style["textDecoration"] = "line-through";
  }
  return style;
}
