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

class UnknownThemeError extends Error {
  theme: string;
  constructor(theme: string) {
    super(`Unknown theme: ${theme}`);
    this.theme = theme;
  }
}

type Config = { scopes?: boolean };
type AnnotatedConfig = { annotations: Annotation[] } & Config;
type LighterResult = {
  lines: Token[][];
  lang: LanguageName;
  colors: ThemeColors;
};
type AnnotatedLighterResult = {
  lines: Lines;
  lang: LanguageName;
  colors: ThemeColors;
};

export { UnknownLanguageError, UnknownThemeError, THEME_NAMES, LANG_NAMES };

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
  LighterResult,
  AnnotatedLighterResult,
};

function isAnnotatedConfig(
  config: Config | AnnotatedConfig
): config is AnnotatedConfig {
  return "annotations" in config;
}

export async function preload(langs: LanguageAlias[], theme?: Theme) {
  await Promise.all([preloadGrammars(langs), preloadTheme(theme)]);
}

export async function highlight(
  code: string,
  lang: LanguageAlias,
  themeOrThemeName?: Theme,
  config?: Config
): Promise<LighterResult>;
export async function highlight(
  code: string,
  lang: LanguageAlias,
  themeOrThemeName: Theme,
  config: AnnotatedConfig
): Promise<AnnotatedLighterResult>;
export async function highlight(
  code: string,
  lang: LanguageAlias,
  themeOrThemeName: Theme = "dark-plus",
  config: Config | AnnotatedConfig = {}
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
  return highlightSync(theCode, theLang, themeOrThemeName, config) as any;
}
export function highlightSync(
  code: string,
  lang: LanguageAlias,
  themeOrThemeName?: Theme,
  config?: Config
): LighterResult;
export function highlightSync(
  code: string,
  lang: LanguageAlias,
  themeOrThemeName: Theme,
  config: AnnotatedConfig
): AnnotatedLighterResult;
export function highlightSync(
  code: string,
  lang: LanguageAlias,
  themeOrThemeName: Theme = "dark-plus",
  config: Config | AnnotatedConfig = {}
) {
  const theCode = code || "";
  const theLang = lang || "text";

  if (typeof theCode !== "string") {
    throw new Error("Syntax highlighter error: code must be a string");
  }
  if (typeof theLang !== "string") {
    throw new Error("Syntax highlighter error: lang must be a string");
  }

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
