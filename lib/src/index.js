import { Registry } from "vscode-textmate";
import vscodeOniguruma from "vscode-oniguruma";
import onig from "vscode-oniguruma/release/onig.wasm";
import { loadTheme, getThemeColors } from "./themes";
import { tokenize } from "./tokenizer.js";
import { loadGrammarByScope } from "./grammars.js";
import { aliasToLangData } from "./language";

let registry = null;

export async function highlight(code, alias, themeOrThemeName = "dark-plus") {
  // get the language object from the alias
  const langData = aliasToLangData(alias);

  // if the language object is not found, throw
  if (!langData) {
    throw new UnknownLanguageError(alias);
  }

  // initialize the registry the first time
  if (!registry) {
    await vscodeOniguruma.loadWASM(onig);
    registry = new Registry({
      onigLib: vscodeOniguruma,
      loadGrammar: (scopeName) => loadGrammarByScope(scopeName),
    });
  }

  // start loading grammars and theme in parallel
  const grammarsPromise = registry.loadGrammar(langData.scopeName);
  const theme = await loadTheme(themeOrThemeName);
  registry.setTheme(theme);

  const grammar = await grammarsPromise;
  const colorMap = registry.getColorMap();

  return {
    lines: tokenize(code, grammar, colorMap),
    lang: langData.id,
    ...getThemeColors(theme),
  };
}

export class UnknownLanguageError extends Error {
  alias;
  constructor(alias) {
    super(`Unknown language: ${alias}`);
    this.alias = alias;
  }
}
