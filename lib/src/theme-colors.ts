export function getThemeColors(theme) {
  return {
    background: theme.bg,
    foreground: theme.fg,
    colorScheme: getColorScheme(theme),
    lineNumberForeground: getColor(theme, "editorLineNumber.foreground"),
    selectionBackground: getColor(theme, "editor.selectionBackground"),
    editorBackground: getColor(theme, "editor.background"),
    editorGroupHeaderBackground: getColor(
      theme,
      "editorGroupHeader.tabsBackground"
    ),
    activeTabBackground: getColor(theme, "tab.activeBackground"),
    activeTabForeground: getColor(theme, "tab.activeForeground"),
    tabBorder: getColor(theme, "tab.border"),
    activeTabBorder: getColor(theme, "tab.activeBorder"),
  };
}

function getColor(theme, name) {
  const colors = theme.colors || {};
  if (colors[name]) {
    return colors[name];
  }

  const defaultColors = defaults[name];
  if (typeof defaultColors === "string") {
    return getColor(theme, defaultColors);
  }

  return getDefault(theme, defaultColors);
}

const contrastBorder = "#6FC3DF";
const defaults = {
  "editorLineNumber.foreground": {
    dark: "#858585",
    light: "#237893",
    hc: "#fffffe",
  },
  "editor.selectionBackground": {
    light: "#ADD6FF",
    dark: "#264F78",
    hc: "#f3f518",
  },
  "editor.background": {
    light: "#fffffe",
    dark: "#1E1E1E",
    hc: "#000000",
  },
  "editorGroupHeader.tabsBackground": {
    dark: "#252526",
    light: "#F3F3F3",
    hc: undefined,
  },
  "tab.activeBackground": "editor.background",
  "tab.activeForeground": {
    dark: "#ffffff",
    light: "#333333",
    hc: "#ffffff",
  },
  "tab.border": {
    dark: "#252526",
    light: "#F3F3F3",
    hc: contrastBorder,
  },
  "tab.activeBorder": "tab.activeBackground",
};

export function getColorScheme(theme) {
  const themeType = getThemeType(theme);
  if (themeType === "dark") {
    return "dark";
  } else if (themeType === "light") {
    return "light";
  }
  return undefined;
}

function getThemeType(theme) {
  return theme.type
    ? theme.type
    : theme.name?.toLowerCase().includes("light")
    ? "light"
    : "dark";
}
function getDefault(theme, defaults) {
  return defaults[getThemeType(theme)];
}

function getGlobalSettings(theme) {
  let settings = theme.settings ? theme.settings : theme.tokenColors;
  const globalSetting = settings
    ? settings.find((s) => {
        return !s.name && !s.scope;
      })
    : undefined;
  return globalSetting?.settings;
}
