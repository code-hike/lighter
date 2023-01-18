import { languages } from "./languages.mjs";

type LanguageObject = {
  id: string;
};

// Description: Convert an alias to lang
// returns undefined if the alias is not found
export function aliasToLang(alias: string) {
  const id = aliasToId[alias] || alias;
  const lang = languages.find((l) => l.id === id);
  return lang;
}

// generated with `node utils/alias-to-id.mjs`
const aliasToId = {
  batch: "bat",
  be: "berry",
  cdc: "cadence",
  clj: "clojure",
  ql: "codeql",
  "c#": "csharp",
  erl: "erlang",
  "f#": "fsharp",
  hbs: "handlebars",
  hs: "haskell",
  js: "javascript",
  fsl: "jssm",
  makefile: "make",
  md: "markdown",
  objc: "objective-c",
  ps: "powershell",
  ps1: "powershell",
  jade: "pug",
  py: "python",
  perl6: "raku",
  rb: "ruby",
  rs: "rust",
  shader: "shaderlab",
  shell: "shellscript",
  bash: "shellscript",
  sh: "shellscript",
  zsh: "shellscript",
  styl: "stylus",
  ts: "typescript",
  cmd: "vb",
  vim: "viml",
  vimscript: "viml",
  文言: "wenyan",
};
