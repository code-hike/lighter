import { Registry } from "vscode-textmate";
import { loadTheme, Theme, StringTheme, RawTheme } from "./theme";
import { tokenize } from "./tokenizer.js";
import { LanguageAlias } from "./language-data";
import { getThemeColors } from "./theme-colors";
import {
  highlightTokens,
  loadGrammars,
  UnknownLanguageError,
} from "./highlighter";
import { extractComments } from "./comments";

export type { LanguageAlias, Theme, StringTheme, RawTheme };
export { UnknownLanguageError };

let registry: Registry | null = null;
export async function highlight(
  code: string,
  alias: LanguageAlias,
  themeOrThemeName: Theme = "dark-plus"
) {
  const { langId, grammarsPromise } = loadGrammars(alias);

  const theme = await loadTheme(themeOrThemeName);
  if (!theme) {
    throw new UnknownThemeError(themeOrThemeName as string);
  }

  const grammar = await grammarsPromise;

  return {
    lines: highlightTokens(code, grammar, theme),
    lang: langId,
    ...getThemeColors(theme),
  };
}

export async function annotatedHighlight(
  code: string,
  alias: LanguageAlias,
  themeOrThemeName: Theme = "dark-plus",
  annotationNames: string[] = []
) {
  const { langId, grammarsPromise } = loadGrammars(alias);

  const theme = await loadTheme(themeOrThemeName);
  if (!theme) {
    throw new UnknownThemeError(themeOrThemeName as string);
  }

  const grammar = await grammarsPromise;

  const { newCode, annotations } = extractComments(
    code,
    grammar,
    annotationNames
  );

  const lines = highlightTokens(newCode, grammar, theme);

  console.log(newCode);
  console.log(JSON.stringify(annotations, null, 2));
}

export class UnknownThemeError extends Error {
  theme: string;
  constructor(theme: string) {
    super(`Unknown theme: ${theme}`);
    this.theme = theme;
  }
}
