import { Registry } from "vscode-textmate";
import vscodeOniguruma from "vscode-oniguruma";
import { tokenize } from "./tokenizer.js";
import onig from "vscode-oniguruma/release/onig.wasm";
import { languages, loadGrammarFromFile } from "./grammars.js";
import { fixTheme } from "./themes.js";

const registered = new Map();
const names = new Map();

export function newRegistry() {
  return new Registry({
    onigLib: createOniguruma(),
    loadGrammar: async (scopeName) => registered.get(scopeName),
  });
}

export async function loadGrammars(registry, alias) {
  // if alias is registered, return
  if (names.has(alias)) {
    return;
  }

  // find language, if not found, fail
  const language = languages.find(
    (l) => l.id === alias || (l.aliases || []).includes(alias)
  );

  if (!language) {
    throw new Error("No grammar for `" + alias);
  }

  // if we use http make request
  // TODO add http support

  // if we use filesystem get the language list and load all in parallel
  const idsToExpand = [language.id];
  const toLoad = [];
  while (idsToExpand.length) {
    const id = idsToExpand.shift();

    const alreadyExpanded =
      registered.has(id) || toLoad.find((l) => l.id === id);

    if (!alreadyExpanded) {
      const lang = languages.find((l) => l.id === id);
      toLoad.unshift(lang);
      if (lang.embeddedLangs) {
        idsToExpand.push(...lang.embeddedLangs);
      }
    }
  }

  const grammarPromises = toLoad.map(loadGrammarFromFile);
  const grammars = await Promise.all(grammarPromises);

  grammars.forEach((grammar) => {
    grammar.names.forEach((name) => names.set(name, grammar.scopeName));
    registered.set(grammar.scopeName, grammar);
  });

  await Promise.all(grammars.map((g) => registry.loadGrammar(g.scopeName)));
}

export function toTokens(code, lang, theme, registry) {
  registry.setTheme(fixTheme(theme));
  const scope = names.get(lang);
  const grammar = registry._syncRegistry._grammars[scope];
  if (!grammar) {
    throw new Error("No grammar for `" + lang);
  }
  return tokenize(code, grammar, registry.getColorMap());
}

async function createOniguruma() {
  await vscodeOniguruma.loadWASM(onig);
  return vscodeOniguruma;
}
