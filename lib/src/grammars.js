import { readJSON } from "./file-system";
import { languages, idDepsById } from "./languages.mjs";
import { fetchJSON } from "./network";

const sourceToGrammarPromise = new Map();

let shouldUseFileSystemPromise = undefined;
let shouldUseFileSystem = undefined;

export async function loadGrammarByScope(scope) {
  if (sourceToGrammarPromise.has(scope)) {
    return sourceToGrammarPromise.get(scope);
  }

  const lang = languages.find((l) => l.scopeName === scope);
  if (!lang) {
    return Promise.resolve(undefined);
  }

  let grammarPromise;

  if (shouldUseFileSystemPromise == null) {
    grammarPromise = loadGrammarFromFile(lang);
    shouldUseFileSystemPromise = grammarPromise
      .then(() => true)
      .catch(() => false);
  }

  if (shouldUseFileSystem == null) {
    shouldUseFileSystem = await shouldUseFileSystemPromise;
  }

  if (shouldUseFileSystem) {
    const promise = grammarPromise || loadGrammarFromFile(lang);
    sourceToGrammarPromise.set(scope, promise);
    return promise;
  }

  // if (!shouldUseFileSystem)
  const deps = getLanguagesToLoad(lang.id);
  // console.log("loading from network", lang.id);
  const fetchPromise = fetchJSON(`grammars?lang=${lang.id}`);
  deps.forEach((l) => {
    if (!sourceToGrammarPromise.has(l.scopeName)) {
      const subPromise = fetchPromise.then((gs) =>
        gs.find((g) => g.scopeName === l.scopeName)
      );
      sourceToGrammarPromise.set(l.scopeName, subPromise);
    }
  });

  const promise = fetchPromise.then((gs) =>
    gs.find((g) => g.scopeName === lang.scopeName)
  );
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
