import { Registry } from "vscode-textmate";
import vscodeOniguruma from "vscode-oniguruma";
import { tokenize } from "./tokenizer.js";
import onig from "vscode-oniguruma/release/onig.wasm";
import { getLanguagesToLoad, loadGrammarFromFile } from "./grammars.js";
import { fetchJSON } from "./network.js";
import { aliasToId, idDepsById } from "./languages.mjs";

const lighter = {
  registry: null,
  aliasToScope: new Map(),
  scopeToGrammar: new Map(),
  loadingIds: new Map(),
};

export function newRegistry() {
  return new Registry({
    onigLib: createOniguruma(),
    loadGrammar: async (scopeName) => lighter.scopeToGrammar.get(scopeName),
  });
}

export async function loadGrammars(alias) {
  if (!lighter.registry) {
    lighter.registry = newRegistry();
  }

  const langId = aliasToId[alias] || alias;

  if (lighter.loadingIds.has(langId)) {
    await lighter.loadingIds.get(langId);
    return;
  }

  const promise = reallyLoadGrammars(langId);

  const deps = idDepsById[langId] || [];
  deps.push(langId);
  deps.forEach((id) => lighter.loadingIds.set(id, promise));

  await promise;
}

async function reallyLoadGrammars(langId) {
  const grammars = await getGrammars(langId);

  const newGrammars = grammars.filter(
    (g) => !lighter.scopeToGrammar.has(g.scopeName)
  );

  newGrammars.forEach((grammar) => {
    grammar.names.forEach((name) =>
      lighter.aliasToScope.set(name, grammar.scopeName)
    );
    lighter.scopeToGrammar.set(grammar.scopeName, grammar);
  });

  await Promise.all(
    newGrammars.map((g) => lighter.registry.loadGrammar(g.scopeName))
  );
}

async function getGrammars(langId) {
  try {
    let toLoad = getLanguagesToLoad(langId);

    const alreadyLoading = toLoad.filter((lang) =>
      lighter.loadingIds.has(lang.id)
    );

    toLoad = toLoad.filter((lang) => !lighter.loadingIds.has(lang.id));

    const grammarPromises = [
      ...toLoad.map(loadGrammarFromFile),
      ...alreadyLoading,
    ];
    return await Promise.all(grammarPromises);
  } catch (e) {
    console.log("fallback to network", e);
    return await fetchGrammars(langId);
  }
}

async function fetchGrammars(langId) {
  return await fetchJSON(`grammars?lang=${langId}`);
}

export function toTokens(code, lang, theme) {
  if (!lighter.aliasToScope.has(lang)) {
    throw new Error("No grammar for `" + lang);
  }

  lighter.registry.setTheme(theme);
  const scope = lighter.aliasToScope.get(lang);
  const grammar = lighter.registry._syncRegistry._grammars[scope];
  return tokenize(code, grammar, lighter.registry.getColorMap());
}

async function createOniguruma() {
  await vscodeOniguruma.loadWASM(onig);
  return vscodeOniguruma;
}
