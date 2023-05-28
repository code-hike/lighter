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

async function reallyLoadThemeByName(name: StringTheme): Promise<RawTheme> {
  try {
    return await readJSON("themes", name + ".json");
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
    colorNames: theme.colorNames,
  };

  const globalSetting = finalTheme.settings.find((s) => !s.name && !s.scope);
  if (globalSetting) {
    const { foreground, background } = globalSetting.settings || {};
    const newColors = {};
    if (foreground && !finalTheme.colors["editor.foreground"]) {
      newColors["editor.foreground"] = foreground;
    }
    if (background && !finalTheme.colors["editor.background"]) {
      newColors["editor.background"] = background;
    }
    if (Object.keys(newColors).length > 0) {
      finalTheme.colors = { ...finalTheme.colors, ...newColors };
    }
  }
  if (!globalSetting) {
    finalTheme.settings = [
      {
        settings: {
          foreground: getColor(finalTheme, "editor.foreground"),
          background: getColor(finalTheme, "editor.background"),
        },
      },
      ...finalTheme.settings,
    ];
  }

  if (theme.type === "from-css" && !finalTheme.colorNames) {
    const colorNames = {};
    let counter = 0;

    finalTheme.settings = finalTheme.settings.map((s) => {
      const setting = { ...s, settings: { ...s.settings } };
      const { foreground, background } = setting.settings || {};
      if (foreground && !colorNames[foreground]) {
        colorNames[foreground] = `#${counter.toString(16).padStart(6, "0")}`;
        counter++;
      }
      if (background && !colorNames[background]) {
        colorNames[background] = `#${counter.toString(16).padStart(6, "0")}`;
        counter++;
      }
      if (foreground) {
        setting.settings.foreground = colorNames[foreground];
      }
      if (background) {
        setting.settings.background = colorNames[background];
      }
      return setting;
    });

    finalTheme.colorNames = colorNames;
  }

  return finalTheme;
}

function getColorScheme(theme: RawTheme) {
  if (theme.type === "from-css") {
    return "from-css";
  }
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
  type: "dark" | "light" | "from-css";
  settings: ThemeSetting[];
  colors: { [key: string]: string };
  colorNames?: { [key: string]: string };
};

export const THEME_NAMES = [
  "dark-plus",
  "dracula-soft",
  "dracula",
  "github-dark",
  "github-dark-dimmed",
  "github-from-css",
  "github-light",
  "light-plus",
  "material-darker",
  "material-default",
  "material-from-css",
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
