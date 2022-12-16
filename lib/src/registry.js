import { Registry } from "vscode-textmate";
import vscodeOniguruma from "vscode-oniguruma";
import { tokenize } from "./tokenizer.js";
import onig from "vscode-oniguruma/release/onig.wasm";
import {
  getLanguagesToLoad,
  loadGrammarFromFile,
  readFile,
} from "./grammars.js";
import { fixTheme } from "./themes.js";

const lighter = {
  registry: null,
  aliasToScope: new Map(),
  scopeToGrammar: new Map(),
};

export function newRegistry() {
  return new Registry({
    onigLib: createOniguruma(),
    loadGrammar: async (scopeName) => lighter.scopeToGrammar.get(scopeName),
  });
}

export async function loadGrammars(alias) {
  if (!lighter.registry) {
    lighter.registry = newRegistry();
  }

  // if alias is registered, return
  if (lighter.aliasToScope.has(alias)) {
    return;
  }

  const grammars = await getGrammars(alias);

  const newGrammars = grammars.filter(
    (g) => !lighter.scopeToGrammar.has(g.scopeName)
  );

  newGrammars.forEach((grammar) => {
    grammar.names.forEach((name) =>
      lighter.aliasToScope.set(name, grammar.scopeName)
    );
    lighter.scopeToGrammar.set(grammar.scopeName, grammar);
  });

  await Promise.all(
    newGrammars.map((g) => lighter.registry.loadGrammar(g.scopeName))
  );
}

async function getGrammars(alias) {
  if (await shouldUseFileSystem()) {
    console.log("using fs for grammars");
    let toLoad = getLanguagesToLoad(alias);
    toLoad = toLoad.filter((lang) => !lighter.aliasToScope.has(lang.id));

    const grammarPromises = toLoad.map(loadGrammarFromFile);
    return await Promise.all(grammarPromises);
  } else {
    return await fetchGrammars(alias, __LIGHTER_VERSION__);
  }
}

async function shouldUseFileSystem() {
  try {
    const content = await readFile("javascript.tmLanguage.json");
    return !!content;
  } catch (e) {
    return false;
  }
}

async function fetchGrammars(alias, version) {
  if (typeof fetch === "function") {
    console.log("using fetch for grammars");
    const r = await fetch(
      `https://lighter.codehike.org/api/grammars?lang=${alias}&v=${version}`
    );
    return await r.json();
  }
  console.log("using https for grammars");

  const https = await import("https");
  const options = {
    host: "lighter.codehike.org",
    path: `/api/grammars?lang=${alias}&v=${version}`,
    method: "GET",
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(JSON.parse(data));
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

export function toTokens(code, lang, theme) {
  if (!lighter.aliasToScope.has(lang)) {
    throw new Error("No grammar for `" + lang);
  }

  lighter.registry.setTheme(fixTheme(theme));
  const scope = lighter.aliasToScope.get(lang);
  const grammar = lighter.registry._syncRegistry._grammars[scope];
  return tokenize(code, grammar, lighter.registry.getColorMap());
}

async function createOniguruma() {
  await vscodeOniguruma.loadWASM(onig);
  return vscodeOniguruma;
}
