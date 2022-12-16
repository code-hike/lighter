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

const registered = new Map();
const names = new Map();

export function newRegistry() {
  return new Registry({
    onigLib: createOniguruma(),
    loadGrammar: async (scopeName) => registered.get(scopeName),
  });
}

export async function loadGrammars(registry, alias) {
  // if alias is registered, return
  if (names.has(alias)) {
    return;
  }

  const grammars = await getGrammars(alias);

  const newGrammars = grammars.filter((g) => !registered.has(g.scopeName));

  newGrammars.forEach((grammar) => {
    grammar.names.forEach((name) => names.set(name, grammar.scopeName));
    registered.set(grammar.scopeName, grammar);
  });

  await Promise.all(newGrammars.map((g) => registry.loadGrammar(g.scopeName)));
}

async function getGrammars(alias) {
  if (await shouldUseFileSystem()) {
    console.log("using fs for grammars");
    let toLoad = getLanguagesToLoad(alias);
    toLoad = toLoad.filter((lang) => !names.has(lang.id));

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

export function toTokens(code, lang, theme, registry) {
  registry.setTheme(fixTheme(theme));
  const scope = names.get(lang);
  const grammar = registry._syncRegistry._grammars[scope];
  if (!grammar) {
    throw new Error("No grammar for `" + lang);
  }
  return tokenize(code, grammar, registry.getColorMap());
}

async function createOniguruma() {
  await vscodeOniguruma.loadWASM(onig);
  return vscodeOniguruma;
}
