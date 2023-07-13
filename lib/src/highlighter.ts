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
import { tokenizeWithScopes, tokenize } from "./tokenizer";
import { FinalTheme } from "./theme";
import { Token } from "./annotations";

let registry: Registry | null = null;

export function preloadGrammars(languages: LanguageAlias[]) {
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

  const promises = languages
    .filter((alias) => alias != "text")
    .map((alias) => {
      const langData = aliasToLangData(alias);
      if (!langData) {
        throw new UnknownLanguageError(alias);
      }
      return registry.loadGrammar(langData.scopeName);
    });

  return Promise.all(promises);
}

export function getGrammar(alias: LanguageAlias): {
  langId: string;
  grammar: IGrammar | null;
} {
  if (alias == "text") {
    return {
      langId: "text",
      grammar: null,
    };
  }

  const langData = aliasToLangData(alias);
  if (!langData) {
    throw new UnknownLanguageError(alias);
  }

  const grammar = getGrammarFromRegistry(langData.scopeName);
  if (!grammar) {
    throw new Error(
      `Syntax highlighting error: grammar for ${alias} not loaded`
    );
  }

  return {
    langId: langData.id,
    grammar,
  };
}

function getGrammarFromRegistry(scopeName: string) {
  const { _syncRegistry } = registry as any;
  return _syncRegistry?._grammars.get(scopeName) as IGrammar;
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
  const colorMap = getColorMap(theme);
  return tokenize(code, grammar, colorMap);
}

function getColorMap(theme: FinalTheme) {
  const colorMap = registry.getColorMap();
  if (!theme.colorNames) return colorMap;
  return colorMap.map((c) => {
    const key = Object.keys(theme.colorNames).find(
      (key) => theme.colorNames[key].toUpperCase() === c.toUpperCase()
    );
    return key || c;
  });
}

export function highlightTokensWithScopes(
  code: string,
  grammar: IGrammar,
  theme: FinalTheme
) {
  registry.setTheme(theme);
  const colorMap = registry.getColorMap();
  return tokenizeWithScopes(code, grammar, colorMap);
}

export function highlightText(code: string): Token[][] {
  const lines = code.split(/\r?\n|\r/g);
  return lines.map((line) => [{ content: line, style: {} }]);
}
