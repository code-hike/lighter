import { Registry } from "vscode-textmate";
import {
  loadWASM,
  createOnigScanner,
  createOnigString,
} from "vscode-oniguruma";
// @ts-ignore
import onig from "vscode-oniguruma/release/onig.wasm";
import { loadTheme, Theme, StringTheme, RawTheme } from "./theme";
import { tokenize } from "./tokenizer.js";
import { loadGrammarByScope } from "./grammars.js";
import { aliasToLangData } from "./language";
import { LanguageAlias } from "./language-data";
import { getThemeColors } from "./theme-colors";

export { LanguageAlias, Theme, StringTheme, RawTheme };

let registry: Registry | null = null;
export async function highlight(
  code: string,
  alias: LanguageAlias,
  themeOrThemeName: Theme = "dark-plus"
) {
  // get the language object from the alias
  const langData = aliasToLangData(alias);

  // if the language object is not found, throw
  if (!langData) {
    throw new UnknownLanguageError(alias);
  }

  // initialize the registry the first time
  if (!registry) {
    const onigLibPromise = loadWASM(onig).then(() => ({
      createOnigScanner,
      createOnigString,
    }));
    registry = new Registry({
      onigLib: onigLibPromise,
      loadGrammar: (scopeName) => loadGrammarByScope(scopeName),
    });
  }

  // start loading grammars and theme in parallel
  const grammarsPromise = registry.loadGrammar(langData.scopeName);
  const theme = await loadTheme(themeOrThemeName);
  if (!theme) {
    throw new UnknownThemeError(themeOrThemeName as string);
  }

  const grammar = (await grammarsPromise)!;

  registry.setTheme(theme);
  const colorMap = registry.getColorMap();

  return {
    lines: tokenize(code, grammar, colorMap),
    lang: langData.id,
    ...getThemeColors(theme),
  };
}

export class UnknownLanguageError extends Error {
  alias: string;
  constructor(alias: string) {
    super(`Unknown language: ${alias}`);
    this.alias = alias;
  }
}

export class UnknownThemeError extends Error {
  theme: string;
  constructor(theme: string) {
    super(`Unknown theme: ${theme}`);
    this.theme = theme;
  }
}
