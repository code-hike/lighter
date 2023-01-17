import { Registry } from "vscode-textmate";
import vscodeOniguruma from "vscode-oniguruma";
import { tokenize } from "./tokenizer.js";
import onig from "vscode-oniguruma/release/onig.wasm";
import { loadGrammarByScope } from "./grammars.js";

const lighter = {
  registry: null,
  aliasToScope: new Map(),
  scopeToGrammar: new Map(),
  loadingIds: new Map(),
};

export function newRegistry() {
  return new Registry({
    onigLib: createOniguruma(),
    loadGrammar: (scopeName) => loadGrammarByScope(scopeName),
  });
}

async function createOniguruma() {
  await vscodeOniguruma.loadWASM(onig);
  return vscodeOniguruma;
}

export async function loadGrammars(lang) {
  if (!lighter.registry) {
    lighter.registry = newRegistry();
  }
  await lighter.registry.loadGrammar(lang.scopeName);
}

export function toTokens(code, lang, theme) {
  lighter.registry.setTheme(theme);
  const { scopeName } = lang;
  const grammar = lighter.registry._syncRegistry._grammars[scopeName];
  return tokenize(code, grammar, lighter.registry.getColorMap());
}
