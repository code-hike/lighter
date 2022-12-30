import { loadGrammars, toTokens } from "./registry";
import { getThemeColors } from "./theme-colors";
import { fixTheme } from "./themes";
import defaultTheme from "../themes/dark-plus.json";
import { loadTheme } from "./load";

export async function highlight(code, lang, theme = defaultTheme) {
  let loadedTheme = theme;
  if (typeof theme === "string") {
    loadedTheme = await loadTheme(theme);
  }

  await loadGrammars(lang);
  const fixedTheme = fixTheme(loadedTheme);
  const lines = toTokens(code, lang, fixedTheme);
  return {
    lines,
    lang,
    ...getThemeColors(fixedTheme),
  };
}
