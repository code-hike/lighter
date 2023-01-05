import { languages } from "../src/languages.mjs";

const aliasToId = {};

languages.forEach((l) => {
  (l.aliases || []).forEach((a) => (aliasToId[a] = l.id));
});

console.log(JSON.stringify(aliasToId));
