import type React from "react";

type StringTheme =
  | "dark-plus"
  | "dracula-soft"
  | "dracula"
  | "github-dark"
  | "github-dark-dimmed"
  | "github-light"
  | "light-plus"
  | "material-darker"
  | "material-default"
  | "material-lighter"
  | "material-ocean"
  | "material-palenight"
  | "min-dark"
  | "min-light"
  | "monokai"
  | "nord"
  | "one-dark-pro"
  | "poimandres"
  | "slack-dark"
  | "slack-ochin"
  | "solarized-dark"
  | "solarized-light";

type Token = { style: React.CSSProperties; content: string };

type Theme = StringTheme | { [key: string]: string };

export const highlight: (
  code: string,
  lang: string,
  theme?: Theme
) => Promise<{
  lines: Token[][];
  foreground: string;
  background: string;
  colorScheme: string;
  selectionBackground: string;
  lineNumberForeground: string;
}>;
