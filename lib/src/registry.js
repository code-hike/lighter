import { Registry } from "vscode-textmate";
import vscodeOniguruma from "vscode-oniguruma";
import { tokenize } from "./tokenizer.js";
import onig from "vscode-oniguruma/release/onig.wasm";
import { getLanguagesToLoad, loadGrammarFromFile } from "./grammars.js";
import { readJSON } from "./file-system";
import { fetchJSON } from "./network.js";

const lighter = {
  registry: null,
  aliasToScope: new Map(),
  scopeToGrammar: new Map(),
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

  // if alias is registered, return
  if (lighter.aliasToScope.has(alias)) {
    return;
  }

  const grammars = await getGrammars(alias);

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

async function getGrammars(alias) {
  try {
    let toLoad = getLanguagesToLoad(alias);
    toLoad = toLoad.filter((lang) => !lighter.aliasToScope.has(lang.id));

    const grammarPromises = toLoad.map(loadGrammarFromFile);
    return await Promise.all(grammarPromises);
  } catch (e) {
    console.log("fallback to network", e);
    return await fetchGrammars(alias);
  }
}

async function shouldUseFileSystem() {
  try {
    const content = await readJSON("grammars", "javascript.tmLanguage.json");
    return !!content;
  } catch (e) {
    return false;
  }
}

async function fetchGrammars(alias) {
  return await fetchJSON(`grammars?lang=${alias}`);
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
