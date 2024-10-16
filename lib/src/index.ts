import {
  Theme,
  StringTheme,
  RawTheme,
  THEME_NAMES,
  preloadTheme,
  getTheme,
  UnknownThemeError,
  getAllThemeColors,
} from "./theme";
import { LanguageAlias, LanguageName, LANG_NAMES } from "./language-data";
import {
  highlightTokensWithScopes,
  highlightTokens,
  UnknownLanguageError,
  getGrammar,
  preloadGrammars,
  highlightText,
} from "./highlighter";
import {
  Annotation,
  AnnotationExtractor,
  extractCommentsFromCode,
} from "./comments";
import {
  applyAnnotations,
  Lines,
  LineGroup,
  Line,
  TokenGroup,
  Tokens,
  Token,
} from "./annotations";
import { getTerminalStyle, highlightTerminal } from "./terminal";
import { getColorScheme } from "./theme-colors";

type Config = { scopes?: boolean };
type AnnotatedConfig = { annotations: Annotation[] } & Config;
type LighterResult = {
  lines: Token[][];
  lang: LanguageName;
  style: {
    color: string;
    background: string;
    colorScheme: string;
  };
};
type AnnotatedLighterResult = {
  lines: Lines;
  lang: LanguageName;
  style: {
    color: string;
    background: string;
    colorScheme: string;
  };
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
      : langId == "terminal"
      ? highlightTerminal(theCode, theme)
      : config?.scopes
      ? highlightTokensWithScopes(theCode, grammar, theme)
      : highlightTokens(theCode, grammar, theme);

  const style =
    langId == "terminal"
      ? getTerminalStyle(theme)
      : {
          color: theme.foreground,
          background: theme.background,
          colorScheme: getColorScheme(theme),
        };

  if (isAnnotatedConfig(config)) {
    const annotations = config?.annotations || [];
    return {
      lines: applyAnnotations(lines, annotations),
      lang: langId,
      style,
    };
  } else {
    return {
      lines: lines,
      lang: langId,
      style,
    };
  }
}

export async function extractAnnotations(
  code: string,
  lang: LanguageAlias,
  annotationExtractor?: AnnotationExtractor
) {
  if (!annotationExtractor) {
    return { code, annotations: [] };
  }

  await preloadGrammars([lang]);
  const { grammar, langId } = getGrammar(lang);

  const { newCode, annotations } = extractCommentsFromCode(
    code,
    grammar,
    langId,
    annotationExtractor
  );

  return { code: newCode, annotations };
}

export async function getThemeColors(themeOrThemeName: Theme) {
  if (!themeOrThemeName) {
    throw new Error("Syntax highlighter error: undefined theme");
  }

  await preload([], themeOrThemeName);
  const theme = getTheme(themeOrThemeName);
  return getAllThemeColors(theme);
}

export function getThemeColorsSync(themeOrThemeName: Theme) {
  if (!themeOrThemeName) {
    throw new Error("Syntax highlighter error: undefined theme");
  }
  const theme = getTheme(themeOrThemeName);
  return getAllThemeColors(theme);
}

export type LighterColors = ReturnType<typeof getThemeColors>;
