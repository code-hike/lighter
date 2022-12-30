import { languages } from "../src/languages.mjs";

const langs = [];

for (const lang of languages) {
  const { id } = lang;
  langs.push(id);
  const alias = lang.aliases || [];
  for (const a of alias) {
    langs.push(a);
  }
}

// sort langs
langs.sort();

// remove duplicates
const uniqueLangs = [...new Set(langs)];

// print as type Lang
console.log("export type Lang =");
for (const lang of uniqueLangs) {
  console.log(`  | "${lang}"`);
}
