import { readJSON } from "./file-system";
import { fetchJSON } from "./network";
import { getColor } from "./theme-colors";

const promiseCache = new Map<StringTheme, Promise<RawTheme>>();
const themeCache = new Map<StringTheme, RawTheme>();

export async function preloadTheme(theme: Theme) {
  if (typeof theme === "string") {
    const name = theme;
    if (!THEME_NAMES.includes(name)) {
      throw new UnknownThemeError(name);
    }
    if (!promiseCache.has(name)) {
      const promise = reallyLoadThemeByName(name).then((theme) => {
        themeCache.set(name, theme);
        return theme;
      });

      promiseCache.set(name, promise);
    }
    return promiseCache.get(name);
  }
  return theme;
}

export function getTheme(theme: Theme): FinalTheme {
  let rawTheme = null;
  if (typeof theme === "string") {
    rawTheme = themeCache.get(theme);
    if (!rawTheme) {
      throw new Error("Syntax highlighting error: theme not loaded");
    }
  } else {
    rawTheme = theme;
  }
  return toFinalTheme(rawTheme);
}

const base16 = import("./../themes/base16.json")
async function reallyLoadThemeByName(name: StringTheme): Promise<RawTheme> {
  try {
    return base16;
  } catch (e) {
    return await fetchJSON(`themes/${name}`);
  }
}

function toFinalTheme(theme: RawTheme | undefined): FinalTheme | undefined {
  if (!theme) {
    return undefined;
  }

  const finalTheme: FinalTheme = {
    ...theme,
    name: theme.name || "unknown-theme",
    type: getColorScheme(theme),
    settings: theme.settings || theme.tokenColors || [],
    colors: theme.colors || {},
  };

  const globalSetting = finalTheme.settings.find((s) => !s.name && !s.scope);
  if (globalSetting) {
    const { foreground, background } = globalSetting.settings || {};
    if (foreground && !finalTheme.colors["editor.foreground"]) {
      finalTheme.colors["editor.foreground"] = foreground;
    }
    if (background && !finalTheme.colors["editor.background"]) {
      finalTheme.colors["editor.background"] = background;
    }
  }
  if (!globalSetting) {
    finalTheme.settings.unshift({
      settings: {
        foreground: getColor(finalTheme, "editor.foreground"),
        background: getColor(finalTheme, "editor.background"),
      },
    });
  }

  return finalTheme;
}

function getColorScheme(theme: RawTheme) {
  const themeType = theme.type
    ? theme.type
    : theme.name?.toLowerCase().includes("light")
    ? "light"
    : "dark";
  if (themeType === "light") {
    return "light";
  } else {
    return "dark";
  }
}

export type RawTheme = {
  name?: string;
  type?: string;
  tokenColors?: ThemeSetting[];
  colors?: { [key: string]: string };
  [key: string]: any;
};

type ThemeSetting = {
  name?: string;
  scope?: string | string[];
  settings: {
    fontStyle?: string;
    foreground?: string;
    background?: string;
  };
};

export type FinalTheme = {
  name: string;
  type: "dark" | "light";
  settings: ThemeSetting[];
  colors: { [key: string]: string };
};

export const THEME_NAMES = [
  "dark-plus",
  "dracula-soft",
  "dracula",
  "github-dark",
  "github-dark-dimmed",
  "github-light",
  "light-plus",
  "material-darker",
  "material-default",
  "material-lighter",
  "material-ocean",
  "material-palenight",
  "min-dark",
  "min-light",
  "monokai",
  "nord",
  "one-dark-pro",
  "poimandres",
  "slack-dark",
  "slack-ochin",
  "solarized-dark",
  "solarized-light",
  "base16",
] as const;
type NamesTuple = typeof THEME_NAMES;
export type StringTheme = NamesTuple[number];

export type Theme = StringTheme | RawTheme;

export class UnknownThemeError extends Error {
  theme: string;
  constructor(theme: string) {
    super(`Unknown theme: ${theme}`);
    this.theme = theme;
  }
}
