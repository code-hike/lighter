import { languages } from "../src/languages.mjs";

function getDependentScopes(langId) {
  const language = languages.find((l) => l.id === langId);

  if (!language) {
    return [];
  }

  const idsToExpand = [language.id];
  const dependentLanguages = [];

  while (idsToExpand.length) {
    const id = idsToExpand.shift();

    const alreadyExpanded = dependentLanguages.find((l) => l.id === id);

    if (!alreadyExpanded) {
      const lang = languages.find((l) => l.id === id);
      dependentLanguages.unshift(lang);
      if (lang.embeddedLangs) {
        idsToExpand.push(...lang.embeddedLangs);
      }
    }
  }

  return dependentLanguages.map((l) => l.id).filter((id) => id !== langId);
}

const idDepsById = {};
languages.forEach((l) => {
  const deps = getDependentScopes(l.id);
  if (deps.length) {
    idDepsById[l.id] = deps;
  }
});
console.log(JSON.stringify(idDepsById));
