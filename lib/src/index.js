import { loadGrammars, newRegistry, toTokens } from "./registry";

let registry = null;

export async function highlight(code, lang, theme) {
  registry = registry || newRegistry();
  await loadGrammars(registry, lang);
  const lines = toTokens(code, lang, theme, registry);
  return {
    lines,
    lang,
  };
}
