import { IRawGrammar } from "vscode-textmate";
import { readJSON } from "./file-system";
import { scopeToLangData } from "./language";
import { fetchJSON } from "./network";

const sourceToGrammarPromise = new Map<string, Promise<IRawGrammar>>();

let shouldUseFileSystemPromise: undefined | Promise<boolean> = undefined;
let shouldUseFileSystem: undefined | boolean = undefined;

export async function loadGrammarByScope(
  scope: string
): Promise<IRawGrammar | undefined> {
  if (sourceToGrammarPromise.has(scope)) {
    return sourceToGrammarPromise.get(scope);
  }

  // we don't have all the scopes, usually not a problem
  const lang = scopeToLangData(scope);
  if (!lang) {
    return Promise.resolve(undefined);
  }

  let grammarPromise: undefined | Promise<IRawGrammar> = undefined;

  if (shouldUseFileSystemPromise === undefined) {
    grammarPromise = loadGrammarFromFile(lang.path);
    shouldUseFileSystemPromise = grammarPromise
      .then(() => true)
      .catch(() => false);
  }

  if (shouldUseFileSystem === undefined) {
    shouldUseFileSystem = await shouldUseFileSystemPromise;
  }

  if (shouldUseFileSystem) {
    const promise = grammarPromise || loadGrammarFromFile(lang.path);
    sourceToGrammarPromise.set(scope, promise);
    return promise;
  }

  // console.log("loading from network", lang.id);
  const fetchPromise = fetchJSON(`grammars?lang=${lang.id}`) as Promise<
    IRawGrammar[]
  >;

  const subScopes = lang.embeddedScopes;
  subScopes.forEach((subScope) => {
    if (!sourceToGrammarPromise.has(subScope)) {
      const subPromise = fetchPromise.then(
        (gs) => gs.find((g) => g.scopeName === subScope)!
      );
      sourceToGrammarPromise.set(subScope, subPromise);
    }
  });

  const promise = fetchPromise.then(
    (gs: IRawGrammar[]) => gs.find((g) => g.scopeName === scope)!
  );
  sourceToGrammarPromise.set(scope, promise);
  return promise;
}

export async function loadGrammarFromFile(path: string) {
  const grammar = await readJSON("grammars", path);
  // grammar.names = [language.id, ...(language.aliases || [])];
  // grammar.embeddedLangs = language.embeddedLangs || [];
  return grammar as IRawGrammar;
}
