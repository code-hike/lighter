import { languages } from "../src/languages.mjs";

const ids = languages.map((l) => l.id);

console.log(JSON.stringify(ids));
