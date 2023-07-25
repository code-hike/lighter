import { FinalTheme } from "./theme";
import { Token } from "./annotations";
import { Color, createAnsiSequenceParser } from "ansi-sequence-parser";
import { getColor } from "./theme-colors";

export function highlightTerminal(code: string, theme: FinalTheme): Token[][] {
  const parser = createAnsiSequenceParser();
  const lines = code
    .split(/\r?\n|\r/g)
    .map((line) => highlightLine(parser, line, theme));

  return lines;
}

function highlightLine(
  parser: ReturnType<typeof createAnsiSequenceParser>,
  line: string,
  theme: FinalTheme
) {
  const ansiLine = parser.parse(line);
  const tokens = ansiLine.map(
    ({ value, foreground, background, decorations }) => {
      const color = getAnsiColor(foreground, theme);
      const style = {};
      if (color) {
        style["color"] = color;
      }
      const backgroundColor = getAnsiColor(background, theme);
      if (backgroundColor) {
        style["background"] = backgroundColor;
      }
      if (decorations.has("bold")) {
        style["fontWeight"] = "bold";
      }
      if (decorations.has("italic")) {
        style["fontStyle"] = "italic";
      }
      if (decorations.has("underline")) {
        style["textDecoration"] = "underline";
      }
      if (decorations.has("strikethrough")) {
        style["textDecoration"] = "line-through";
      }
      if (decorations.has("reverse")) {
        style["color"] = backgroundColor;
        style["background"] = color;
      }
      if (decorations.has("dim")) {
        style["opacity"] = 0.5;
      }

      return {
        content: value,
        style,
      };
    }
  );
  return tokens;
}

function getAnsiColor(color: Color | null, theme: FinalTheme) {
  if (!color) return undefined;
  if (color.type === "named") {
    // capitalize name
    const name = color.name[0].toUpperCase() + color.name.slice(1);
    return getColor(theme, "terminal.ansi" + name);
  }
  if (color.type === "rgb") {
    const [r, g, b] = color.rgb;
    return `rgb(${r}, ${g}, ${b})`;
  }
  return undefined;
}

export function getTerminalStyle(theme: FinalTheme) {
  return {
    color: getColor(theme, "terminal.foreground"),
    background: getColor(theme, "terminal.background"),
  };
}
