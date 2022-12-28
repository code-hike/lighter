export function getThemeColors(theme) {
  const colors = theme.colors || {};
  return {
    background: theme.bg,
    foreground: theme.fg,
    colorScheme: getColorScheme(theme),
    lineNumberForeground:
      colors["editorLineNumber.foreground"] ||
      getDefault(theme, {
        dark: "#858585",
        light: "#237893",
        hc: "#fffffe",
      }),
    selectionBackground:
      colors["editor.selectionBackground"] ||
      getDefault(theme, {
        light: "#ADD6FF",
        dark: "#264F78",
        hc: "#f3f518",
      }),
  };
}

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
