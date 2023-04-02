import {
  Theme,
  StringTheme,
  RawTheme,
  THEME_NAMES,
  preloadTheme,
  getTheme,
} from "./theme";
import { LanguageAlias, LanguageName, LANG_NAMES } from "./language-data";
import { getThemeColors, ThemeColors } from "./theme-colors";
import {
  highlightTokensWithScopes,
  highlightTokens,
  UnknownLanguageError,
  getGrammar,
  preloadGrammars,
  highlightText,
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
  const theCode = code || "";
  const theLang = lang || "text";

  if (typeof theCode !== "string") {
    throw new Error("Syntax highlighter error: code must be a string");
  }
  if (typeof theLang !== "string") {
    throw new Error("Syntax highlighter error: lang must be a string");
  }

  await preload([theLang], themeOrThemeName);
  const { langId, grammar } = getGrammar(theLang);
  const theme = getTheme(themeOrThemeName);

  const lines =
    langId == "text"
      ? highlightText(theCode)
      : config?.scopes
      ? highlightTokensWithScopes(theCode, grammar, theme)
      : highlightTokens(theCode, grammar, theme);

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

export async function preload(langs: LanguageAlias[], theme?: Theme) {
  await Promise.all([preloadGrammars(langs), preloadTheme(theme)]);
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

  await preloadGrammars([lang]);
  const { grammar } = getGrammar(lang);

  const { newCode, annotations } = extractCommentsFromCode(
    code,
    grammar,
    annotationNames
  );

  return { code: newCode, annotations };
}
