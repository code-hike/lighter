import { loadGrammars, toTokens } from "./registry";
import { getThemeColors } from "./theme-colors";
import { fixTheme } from "./themes";
import { loadTheme } from "./load";
import { aliasToLang } from "./alias";

export async function highlight(code, alias, theme = "dark-plus") {
  const lang = aliasToLang(alias);
  if (!lang) {
    throw new UnknownLanguageError(alias);
  }

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
    lang: lang.id,
    ...getThemeColors(fixedTheme),
  };
}

export class UnknownLanguageError extends Error {
  alias;
  constructor(alias) {
    super(`Unknown language: ${alias}`);
    this.alias = alias;
  }
}
