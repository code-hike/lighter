import { loadTheme, Theme, StringTheme, RawTheme } from "./theme";
import { LanguageAlias } from "./language-data";
import { getThemeColors, ThemeColors } from "./theme-colors";
import {
  highlightTokensWithScopes,
  highlightTokens,
  loadGrammars,
  UnknownLanguageError,
} from "./highlighter";
import { Annotation, extractCommentsFromCode } from "./comments";
import {
  applyAnnotations,
  Lines,
  LineGroup,
  Line,
  TokenGroup,
  Tokens,
  Token,
} from "./annotations";

export type {
  LanguageAlias,
  Theme,
  StringTheme,
  RawTheme,
  Annotation,
  Lines,
  LineGroup,
  Line,
  TokenGroup,
  Tokens,
  Token,
  ThemeColors,
};
export { UnknownLanguageError };

export async function highlightWithScopes(
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
    lines: highlightTokensWithScopes(code, grammar, theme),
    lang: langId,
    colors: getThemeColors(theme),
  };
}

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
    colors: getThemeColors(theme),
  };
}

export async function extractAnnotations(
  code: string,
  alias: LanguageAlias,
  annotationNames: string[] = []
) {
  if (annotationNames.length === 0) {
    return { code, annotations: [] };
  }

  const { grammarsPromise } = loadGrammars(alias);

  const grammar = await grammarsPromise;

  const { newCode, annotations } = extractCommentsFromCode(
    code,
    grammar,
    annotationNames
  );

  return { code: newCode, annotations };
}

export async function annotatedHighlight(
  code: string,
  alias: LanguageAlias,
  themeOrThemeName: Theme = "dark-plus",
  annotations: Annotation[] = []
) {
  const { langId, grammarsPromise } = loadGrammars(alias);

  const theme = await loadTheme(themeOrThemeName);
  if (!theme) {
    throw new UnknownThemeError(themeOrThemeName as string);
  }

  const grammar = await grammarsPromise;

  const lines = highlightTokens(code, grammar, theme);

  return {
    lines: applyAnnotations(lines, annotations),
    lang: langId,
    colors: getThemeColors(theme),
  };
}

export class UnknownThemeError extends Error {
  theme: string;
  constructor(theme: string) {
    super(`Unknown theme: ${theme}`);
    this.theme = theme;
  }
}
