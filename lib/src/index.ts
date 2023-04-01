import { loadTheme, Theme, StringTheme, RawTheme, THEME_NAMES } from "./theme";
import { LanguageAlias, LanguageName, LANG_NAMES } from "./language-data";
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

class UnknownThemeError extends Error {
  theme: string;
  constructor(theme: string) {
    super(`Unknown theme: ${theme}`);
    this.theme = theme;
  }
}

export { UnknownLanguageError, UnknownThemeError, THEME_NAMES, LANG_NAMES };

type Config = { scopes?: boolean };
type AnnotatedConfig = { annotations: Annotation[] } & Config;
type Result = {
  lines: Token[][];
  lang: LanguageName;
  colors: ThemeColors;
};
type AnnotatedResult = {
  lines: Lines;
  lang: LanguageName;
  colors: ThemeColors;
};

function isAnnotatedConfig(
  config: Config | AnnotatedConfig
): config is AnnotatedConfig {
  return "annotations" in config;
}

export async function highlight(
  code: string,
  lang: LanguageAlias,
  themeOrThemeName?: Theme,
  config?: Config
): Promise<Result>;
export async function highlight(
  code: string,
  lang: LanguageAlias,
  themeOrThemeName: Theme,
  config: AnnotatedConfig
): Promise<AnnotatedResult>;
export async function highlight<GivenConfig extends Config>(
  code: string,
  lang: LanguageAlias,
  themeOrThemeName: Theme = "dark-plus",
  config: Config = {}
) {
  const { langId, grammarsPromise } = loadGrammars(lang);

  const theme = await loadTheme(themeOrThemeName);
  if (!theme) {
    throw new UnknownThemeError(themeOrThemeName as string);
  }

  const grammar = await grammarsPromise;

  const lines = config?.scopes
    ? highlightTokensWithScopes(code, grammar, theme)
    : highlightTokens(code, grammar, theme);

  if (isAnnotatedConfig(config)) {
    const annotations = config?.annotations || [];
    return {
      lines: applyAnnotations(lines, annotations),
      lang: langId,
      colors: getThemeColors(theme),
    };
  } else {
    return {
      lines: lines,
      lang: langId,
      colors: getThemeColors(theme),
    };
  }
}

/** @deprecated use highlight instead */
export async function highlightWithScopes(
  code: string,
  alias: LanguageAlias,
  themeOrThemeName: Theme = "dark-plus"
) {
  return highlight(code, alias, themeOrThemeName, { scopes: true });
}

/** @deprecated use highlight instead */
export async function annotatedHighlight(
  code: string,
  alias: LanguageAlias,
  themeOrThemeName: Theme = "dark-plus",
  annotations: Annotation[] = []
) {
  return highlight(code, alias, themeOrThemeName, { annotations });
}
export async function extractAnnotations(
  code: string,
  lang: LanguageAlias,
  annotationNames: string[] = []
) {
  if (annotationNames.length === 0) {
    return { code, annotations: [] };
  }

  const { grammarsPromise } = loadGrammars(lang);

  const grammar = await grammarsPromise;

  const { newCode, annotations } = extractCommentsFromCode(
    code,
    grammar,
    annotationNames
  );

  return { code: newCode, annotations };
}
