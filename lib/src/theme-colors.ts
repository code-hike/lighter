import { transparent } from "./color";
import type { FinalTheme } from "./theme";

export type ThemeColors = ReturnType<typeof getThemeColors>;

export function getThemeColors(theme: FinalTheme) {
  return {
    colorScheme: getColorScheme(theme),
    ...getColors(theme),
  };
}

export function getColorScheme(theme: FinalTheme) {
  return theme.type === "from-css" ? "var(--ch-0)" : theme.type;
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
  inactiveTabBackground: "tab.inactiveBackground",
  inactiveTabForeground: "tab.inactiveForeground",
  diffInsertedTextBackground: "diffEditor.insertedTextBackground",
  diffInsertedLineBackground: "diffEditor.insertedLineBackground",
  diffRemovedTextBackground: "diffEditor.removedTextBackground",
  diffRemovedLineBackground: "diffEditor.removedLineBackground",
  iconForeground: "icon.foreground",
  sideBarBackground: "sideBar.background",
  sideBarForeground: "sideBar.foreground",
  sideBarBorder: "sideBar.border",
  listSelectionBackground: "list.inactiveSelectionBackground",
  listSelectionForeground: "list.inactiveSelectionForeground",
  listHoverBackground: "list.hoverBackground",
  listHoverForeground: "list.hoverForeground",
  tabsBorder: "editorGroupHeader.tabsBorder",
  activeTabTopBorder: "tab.activeBorderTop",
  hoverTabBackground: "tab.hoverBackground",
  hoverTabForeground: "tab.hoverForeground",
};

function getColors(theme: FinalTheme) {
  const colors = {};
  for (const key in colorNamesToKeys) {
    colors[key] = getColor(theme, colorNamesToKeys[key]);
  }
  return colors as typeof colorNamesToKeys;
}

export function getColor(theme: FinalTheme, name: string): string | undefined {
  const colors = theme.colors || {};
  if (colors[name]) {
    return colors[name];
  }

  const defaultColors = defaults[name];

  if (!defaultColors) {
    throw new Error(`Unknown theme color key: ${name}`);
  }

  if (typeof defaultColors === "string") {
    return getColor(theme, defaultColors);
  }

  return getDefault(theme, defaultColors);
}

function getDefault(theme: FinalTheme, defaults) {
  const defaultByScheme = defaults[theme.type];
  if (Array.isArray(defaultByScheme)) {
    const [fn, name, ...args] = defaultByScheme;
    const color = getColor(theme, name);
    return fn(color, ...args);
  }
  return defaultByScheme;
}

// defaults from: https://github.com/microsoft/vscode/blob/main/src/vs/workbench/common/theme.ts
// and: https://github.com/microsoft/vscode/blob/main/src/vs/editor/common/core/editorColorRegistry.ts
// and: https://github.com/microsoft/vscode/blob/main/src/vs/platform/theme/common/colorRegistry.ts
// keys from : https://code.visualstudio.com/api/references/theme-color#editor-groups-tabs
const contrastBorder = "#6FC3DF";
const defaults = {
  "editor.foreground": { dark: "#bbbbbb", light: "#333333", hc: "#ffffff" },
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
  "editor.background": { light: "#fffffe", dark: "#1E1E1E", hc: "#000000" },
  "editorGroupHeader.tabsBackground": { dark: "#252526", light: "#F3F3F3" },
  "tab.activeBackground": "editor.background",
  "tab.activeForeground": { dark: "#ffffff", light: "#333333", hc: "#ffffff" },
  "tab.border": { dark: "#252526", light: "#F3F3F3", hc: contrastBorder },
  "tab.activeBorder": "tab.activeBackground",
  "tab.inactiveBackground": { dark: "#2D2D2D", light: "#ECECEC" },
  "tab.inactiveForeground": {
    dark: [transparent, "tab.activeForeground", 0.5],
    light: [transparent, "tab.activeForeground", 0.5],
    hc: "#ffffff",
  },
  "diffEditor.insertedTextBackground": {
    dark: "#9ccc2c33",
    light: "#9ccc2c40",
  },
  "diffEditor.removedTextBackground": { dark: "#ff000033", light: "#ff000033" },
  "diffEditor.insertedLineBackground": {
    dark: "#9bb95533",
    light: "#9bb95533",
  },
  "diffEditor.removedLineBackground": { dark: "#ff000033", light: "#ff000033" },
  "icon.foreground": { dark: "#C5C5C5", light: "#424242", hc: "#FFFFFF" },
  "sideBar.background": { dark: "#252526", light: "#F3F3F3", hc: "#000000" },
  "sideBar.foreground": "editor.foreground",
  "sideBar.border": "sideBar.background",
  "list.inactiveSelectionBackground": { dark: "#37373D", light: "#E4E6F1" },
  "list.inactiveSelectionForeground": {},
  "list.hoverBackground": { dark: "#2A2D2E", light: "#F0F0F0" },
  "list.hoverForeground": {},
  "editorGroupHeader.tabsBorder": { hc: contrastBorder },
  "tab.activeBorderTop": { hc: contrastBorder },
  "tab.hoverBackground": "tab.inactiveBackground",
  "tab.hoverForeground": "tab.inactiveForeground",
  "editor.rangeHighlightBackground": { dark: "#ffffff0b", light: "#fdff0033" },
  "editor.infoForeground": { dark: "#3794FF", light: "#1a85ff", hc: "#3794FF" },
  "input.border": { hc: contrastBorder },
  "input.background": { dark: "#3C3C3C", light: "#fffffe", hc: "#000000" },
  "input.foreground": "editor.foreground",
  "editor.lineHighlightBackground": {},
  focusBorder: { light: "#0090F1", dark: "#007FD4", hc: contrastBorder },
  "editorGroup.border": {
    dark: "#444444",
    light: "#E7E7E7",
    hc: contrastBorder,
  },
  "list.activeSelectionBackground": {
    dark: "#094771",
    light: "#0060C0",
    hc: "#000000",
  },
  "list.activeSelectionForeground": {
    dark: "#fffffe",
    light: "#fffffe",
    hc: "#fffffe",
  },
  // this aren't from vscode, they are specific to lighter
  "lighter.inlineBackground": {
    dark: [transparent, "editor.background", 0.9],
    light: [transparent, "editor.background", 0.9],
  },
};
