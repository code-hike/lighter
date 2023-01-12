import { loadGrammars, toTokens } from "./registry";
import { getThemeColors } from "./theme-colors";
import { fixTheme } from "./themes";
import { loadTheme } from "./load";

export async function highlight(code, lang, theme = "dark-plus") {
  const grammarsPromise = loadGrammars(lang);

  let loadedTheme = theme;
  if (typeof theme === "string") {
    loadedTheme = await loadTheme(theme);
  }
  const fixedTheme = fixTheme(loadedTheme);
  await grammarsPromise;
  const lines = toTokens(code, lang, fixedTheme);
  return {
    lines,
    lang,
    ...getThemeColors(fixedTheme),
  };
}
