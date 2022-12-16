import { loadGrammars, toTokens } from "./registry";

export async function highlight(code, lang, theme) {
  await loadGrammars(lang);
  const lines = toTokens(code, lang, theme);
  return {
    lines,
    lang,
  };
}
