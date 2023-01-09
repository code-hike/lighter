import { Registry } from "vscode-textmate";
import vscodeOniguruma from "vscode-oniguruma";
import { tokenize } from "./tokenizer.js";
import onig from "vscode-oniguruma/release/onig.wasm";
import { loadGrammarByScope } from "./grammars.js";
import { aliasToId, languages } from "./languages.mjs";

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

export async function loadGrammars(alias) {
  if (!lighter.registry) {
    lighter.registry = newRegistry();
  }

  const langId = aliasToId[alias] || alias;
  const lang = languages.find((l) => l.id === langId);
  const promise = lighter.registry.loadGrammar(lang.scopeName);

  await promise;
}

export function toTokens(code, lang, theme) {
  lighter.registry.setTheme(theme);

  const langId = aliasToId[lang] || lang;
  const { scopeName } = languages.find((l) => l.id === langId);

  const grammar = lighter.registry._syncRegistry._grammars[scopeName];
  return tokenize(code, grammar, lighter.registry.getColorMap());
}
