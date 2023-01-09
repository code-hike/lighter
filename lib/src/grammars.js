import { readJSON } from "./file-system";
import { languages, idDepsById } from "./languages.mjs";
import { fetchJSON } from "./network";

const sourceToGrammarPromise = new Map();
let shoudUseFileSystem = true;

export function loadGrammarByScope(scope) {
  if (sourceToGrammarPromise.has(scope)) {
    return sourceToGrammarPromise.get(scope);
  }

  const lang = languages.find((l) => l.scopeName === scope);
  if (!lang) {
    return Promise.resolve(undefined);
  }

  let promise;
  if (shoudUseFileSystem) {
    try {
      promise = loadGrammarFromFile(lang);
    } catch (e) {
      shoudUseFileSystem = false;
    }
  }

  if (!shoudUseFileSystem) {
    const deps = getLanguagesToLoad(lang.id);
    console.log("loading from network", lang.id);
    const fetchPromise = fetchJSON(`grammars?lang=${lang.id}`);
    deps.forEach((l) => {
      if (!sourceToGrammarPromise.has(l.scopeName)) {
        const subPromise = fetchPromise.then((gs) =>
          gs.find((g) => g.scopeName === l.scopeName)
        );
        sourceToGrammarPromise.set(l.scopeName, subPromise);
      }
    });

    promise = fetchPromise.then((gs) =>
      gs.find((g) => g.scopeName === lang.scopeName)
    );
  }

  sourceToGrammarPromise.set(scope, promise);
  return promise;
}

export async function loadGrammarFromFile(language) {
  const grammar = await readJSON("grammars", language.path);
  grammar.names = [language.id, ...(language.aliases || [])];
  grammar.embeddedLangs = language.embeddedLangs || [];
  return grammar;
}

export function getLanguagesToLoad(langId) {
  const deps = idDepsById[langId] || [];
  deps.push(langId);
  return deps.map((id) => languages.find((l) => l.id === id));
}
