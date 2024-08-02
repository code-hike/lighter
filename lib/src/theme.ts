import { readTheme } from "./file-system";
import { fetchJSON } from "./network";
import { getColor, getColorScheme } from "./theme-colors";

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
    return await readTheme(name);
  } catch (e) {
    return await fetchJSON(`themes/${name}`);
  }
}

function toFinalTheme(theme: RawTheme | undefined): FinalTheme | undefined {
  if (!theme) {
    return undefined;
  }

  const settings = theme.settings || theme.tokenColors || [];

  const finalTheme: FinalTheme = {
    name: theme.name || "unknown-theme",
    type: getThemeType(theme),
    foreground: "",
    background: "",
    settings,
    colors: theme.colors || {},
    colorNames: theme.colorNames,
  };

  const globalSetting = settings.find((s) => !s.scope);

  if (globalSetting) {
    const { foreground, background } = globalSetting?.settings || {};
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
    finalTheme.foreground = foreground;
    finalTheme.background = background;
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

  finalTheme.background =
    finalTheme.background || getColor(finalTheme, "editor.background");
  finalTheme.foreground =
    finalTheme.foreground || getColor(finalTheme, "editor.foreground");

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

function getThemeType(theme: RawTheme) {
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
  foreground: string;
  background: string;
  settings: ThemeSetting[];
  colors: { [key: string]: string };
  // only for "from-css" themes
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

export function getAllThemeColors(theme: FinalTheme) {
  const c = (key: string) => {
    if (key === "colorScheme") {
      return getColorScheme(theme);
    }
    if (key === "foreground") {
      return theme.foreground;
    }
    if (key === "background") {
      return theme.background;
    }
    return getColor(theme, key);
  };
  return {
    colorScheme: c("colorScheme"),
    foreground: c("foreground"),
    background: c("background"),
    lighter: {
      inlineBackground: c("lighter.inlineBackground"),
    },
    editor: {
      background: c("editor.background"),
      foreground: c("editor.foreground"),
      lineHighlightBackground: c("editor.lineHighlightBackground"),
      rangeHighlightBackground: c("editor.rangeHighlightBackground"),
      infoForeground: c("editor.infoForeground"),
      selectionBackground: c("editor.selectionBackground"),
    },
    focusBorder: c("focusBorder"),
    tab: {
      activeBackground: c("tab.activeBackground"),
      activeForeground: c("tab.activeForeground"),
      inactiveBackground: c("tab.inactiveBackground"),
      inactiveForeground: c("tab.inactiveForeground"),
      border: c("tab.border"),
      activeBorder: c("tab.activeBorder"),
      activeBorderTop: c("tab.activeBorderTop"),
    },
    editorGroup: {
      border: c("editorGroup.border"),
    },
    editorGroupHeader: {
      tabsBackground: c("editorGroupHeader.tabsBackground"),
    },
    editorLineNumber: {
      foreground: c("editorLineNumber.foreground"),
    },
    input: {
      background: c("input.background"),
      foreground: c("input.foreground"),
      border: c("input.border"),
    },
    icon: {
      foreground: c("icon.foreground"),
    },
    sideBar: {
      background: c("sideBar.background"),
      foreground: c("sideBar.foreground"),
      border: c("sideBar.border"),
    },
    list: {
      activeSelectionBackground: c("list.activeSelectionBackground"),
      activeSelectionForeground: c("list.activeSelectionForeground"),
      hoverBackground: c("list.hoverBackground"),
      hoverForeground: c("list.hoverForeground"),
    },
  };
}
