import { getColorScheme } from "./theme-colors";

export function fixTheme(rawTheme) {
  const type = getColorScheme(rawTheme);

  const shikiTheme = {
    name: rawTheme.name,
    type,
    ...rawTheme,
    ...getThemeDefaultColors(rawTheme),
  };

  if (rawTheme.include) {
    shikiTheme.include = rawTheme.include;
  }
  if (rawTheme.tokenColors) {
    shikiTheme.settings = rawTheme.tokenColors;
    delete shikiTheme.tokenColors;
  }

  repairTheme(shikiTheme);

  return shikiTheme;
}

function repairTheme(theme) {
  // Has the default no-scope setting with fallback colors
  if (!theme.settings) theme.settings = [];

  if (
    theme.settings[0] &&
    theme.settings[0].settings &&
    !theme.settings[0].scope
  ) {
    return;
  }

  // Push a no-scope setting with fallback colors
  theme.settings.unshift({
    settings: {
      foreground: theme.fg,
      background: theme.bg,
    },
  });
}

const VSCODE_FALLBACK_EDITOR_FG = { light: "#333333", dark: "#bbbbbb" };
const VSCODE_FALLBACK_EDITOR_BG = { light: "#fffffe", dark: "#1e1e1e" };

function getThemeDefaultColors(theme) {
  let fg, bg;

  /**
   * First try:
   * Theme might contain a global `tokenColor` without `name` or `scope`
   * Used as default value for foreground/background
   */
  let settings = theme.settings ? theme.settings : theme.tokenColors;
  const globalSetting = settings
    ? settings.find((s) => {
        return !s.name && !s.scope;
      })
    : undefined;

  if (globalSetting?.settings?.foreground) {
    fg = globalSetting.settings.foreground;
  }
  if (globalSetting?.settings?.background) {
    bg = globalSetting.settings.background;
  }

  /**
   * Second try:
   * If there's no global `tokenColor` without `name` or `scope`
   * Use `editor.foreground` and `editor.background`
   */
  if (!fg && theme?.colors?.["editor.foreground"]) {
    fg = theme.colors["editor.foreground"];
  }
  if (!bg && theme?.colors?.["editor.background"]) {
    bg = theme.colors["editor.background"];
  }

  /**
   * Last try:
   * If there's no fg/bg color specified in theme, use default
   */
  if (!fg) {
    fg =
      theme.type === "light"
        ? VSCODE_FALLBACK_EDITOR_FG.light
        : VSCODE_FALLBACK_EDITOR_FG.dark;
  }
  if (!bg) {
    bg =
      theme.type === "light"
        ? VSCODE_FALLBACK_EDITOR_BG.light
        : VSCODE_FALLBACK_EDITOR_BG.dark;
  }

  return {
    fg,
    bg,
  };
}
