import { languages } from "./languages.mjs";
import { promises as fs } from "fs";

async function updateLibData() {
  const aliasOrIdToScope = {};
  languages.forEach((language) => {
    aliasOrIdToScope[language.id] = language.scopeName;
    (language.aliases || []).forEach((alias) => {
      aliasOrIdToScope[alias] = language.scopeName;
    });
  });

  const scopeToLanguageData = {};
  languages.forEach((language) => {
    scopeToLanguageData[language.scopeName] = {
      id: language.id,
      path: language.path,
      embeddedScopes: getDependentLangs(language.id).map((l) => l.scopeName),
    };
  });

  const aliasList = Object.keys(aliasOrIdToScope)
    .map((alias) => `"${alias}"`)
    .join(" | ");
  const nameList = languages.map((l) => `"${l.id}"`).join(" | ");
  const scopeList = languages.map((l) => `"${l.scopeName}"`).join(" | ");
  const content = `// generated with \`node utils/update-language-data.mjs\`

export type LanguageAlias = ${aliasList};
export type LanguageName = ${nameList};
export type ScopeName = ${scopeList};

export type LanguageData = {
  id: LanguageName;
  path: string;
  embeddedScopes: ScopeName[];
};
  
export const aliasOrIdToScope: Record<LanguageAlias, ScopeName> = ${JSON.stringify(
    aliasOrIdToScope,
    null,
    2
  )};
export const scopeToLanguageData: Record<ScopeName, LanguageData> = ${JSON.stringify(
    scopeToLanguageData,
    null,
    2
  )};
`;

  await fs.writeFile("./src/language-data.ts", content, "utf8");
}

function getDependentLangs(langId) {
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

  return dependentLanguages.filter((l) => l.id !== langId);
}

async function updateApiData() {
  const idToPaths = {};

  languages.forEach((language) => {
    const deps = getDependentLangs(language.id);
    const paths = deps.map((l) => l.path);
    idToPaths[language.id] = [language.path, ...paths];
  });

  const path = "../web/pages/api/grammars.js";
  const file = await fs.readFile(path, "utf8");
  const comment = `// generated with \`node utils/update-language-data.mjs\``;
  const toAppend = `
const idToPaths = ${JSON.stringify(idToPaths, null, 2)};
  `;
  // replace all after comment with toAppend
  const content = file.replace(/\/\/ generated with.*$/s, comment + toAppend);
  await fs.writeFile(path, content, "utf8");
}

updateLibData();
updateApiData();
