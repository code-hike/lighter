// download grammars to lib/grammars
await import("./1.download-grammars.mjs");

// regenerate lib/utils/languages.mjs
await import("./2.update-languages.mjs");

// regenerate lib/src/language-data.ts
await import("./3.update-languages-data.mjs");
