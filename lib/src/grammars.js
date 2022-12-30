import { readJSON } from "./file-system";
import { languages } from "./languages.mjs";

export async function loadGrammarFromFile(language) {
  const grammar = await readJSON("grammars", language.path);
  grammar.names = [language.id, ...(language.aliases || [])];
  grammar.embeddedLangs = language.embeddedLangs || [];
  return grammar;
}

export function getLanguagesToLoad(alias) {
  const language = languages.find(
    (l) => l.id === alias || (l.aliases || []).includes(alias)
  );

  if (!language) {
    return [];
  }

  const idsToExpand = [language.id];
  const toLoad = [];

  while (idsToExpand.length) {
    const id = idsToExpand.shift();

    const alreadyExpanded = toLoad.find((l) => l.id === id);

    if (!alreadyExpanded) {
      const lang = languages.find((l) => l.id === id);
      toLoad.unshift(lang);
      if (lang.embeddedLangs) {
        idsToExpand.push(...lang.embeddedLangs);
      }
    }
  }

  return toLoad;
}
