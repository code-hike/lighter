import type { FinalTheme } from "./theme";

export function getThemeColors(theme: FinalTheme) {
  return {
    colorScheme: theme.type,
    ...getColors(theme),
  };
}

const colorNamesToKeys = {
  background: "editor.background",
  foreground: "editor.foreground",
  lineNumberForeground: "editorLineNumber.foreground",
  selectionBackground: "editor.selectionBackground",
  editorBackground: "editor.background",
  editorGroupHeaderBackground: "editorGroupHeader.tabsBackground",
  activeTabBackground: "tab.activeBackground",
  activeTabForeground: "tab.activeForeground",
  tabBorder: "tab.border",
  activeTabBorder: "tab.activeBorder",
};

function getColors(theme: FinalTheme) {
  const colors = {};
  for (const key in colorNamesToKeys) {
    colors[key] = getColor(theme, colorNamesToKeys[key]);
  }
  return colors as typeof colorNamesToKeys;
}

export function getColor(theme: FinalTheme, name: string) {
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

function getDefault(theme: FinalTheme, defaults) {
  return defaults[theme.type];
}

// defaults from: https://github.com/microsoft/vscode/blob/main/src/vs/workbench/common/theme.ts
// and: https://github.com/microsoft/vscode/blob/main/src/vs/editor/common/core/editorColorRegistry.ts
// and: https://github.com/microsoft/vscode/blob/main/src/vs/platform/theme/common/colorRegistry.ts
// keys from : https://code.visualstudio.com/api/references/theme-color#editor-groups-tabs
const contrastBorder = "#6FC3DF";
const defaults = {
  "editor.foreground": {
    dark: "#bbbbbb",
    light: "#333333",
    hc: "#ffffff",
  },
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
