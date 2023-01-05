import { readJSON } from "./file-system";
import { languages, idDepsById } from "./languages.mjs";

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
