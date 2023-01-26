import { IGrammar, Registry } from "vscode-textmate";
import {
  loadWASM,
  createOnigScanner,
  createOnigString,
} from "vscode-oniguruma";
// @ts-ignore
import onig from "vscode-oniguruma/release/onig.wasm";
import { aliasToLangData } from "./language";
import { loadGrammarByScope } from "./grammars";
import { LanguageAlias } from "./language-data";
import { tokenize } from "./tokenizer";
import { FinalTheme } from "./theme";

let registry: Registry | null = null;

export function loadGrammars(alias: LanguageAlias) {
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

  const grammarsPromise = registry.loadGrammar(langData.scopeName);
  return { langId: langData.id, grammarsPromise };
}

export class UnknownLanguageError extends Error {
  alias: string;
  constructor(alias: string) {
    super(`Unknown language: ${alias}`);
    this.alias = alias;
  }
}

export function highlightTokens(
  code: string,
  grammar: IGrammar,
  theme: FinalTheme
) {
  registry.setTheme(theme);
  const colorMap = registry.getColorMap();
  return tokenize(code, grammar, colorMap);
}
