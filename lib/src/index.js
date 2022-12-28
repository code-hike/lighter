import { loadGrammars, toTokens } from "./registry";
import { getThemeColors } from "./theme-colors";
import { fixTheme } from "./themes";

export async function highlight(code, lang, theme) {
  await loadGrammars(lang);
  const fixedTheme = fixTheme(theme);
  const lines = toTokens(code, lang, fixedTheme);
  return {
    lines,
    lang,
    ...getThemeColors(fixedTheme),
  };
}
