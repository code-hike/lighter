import type { IRawGrammar } from "vscode-textmate";
import { importGrammar, importTheme } from "./dynamic-imports";

export async function readGrammar(langId: string): Promise<IRawGrammar> {
  return importGrammar(langId);
}

export async function readTheme(themeName: string): Promise<any> {
  return importTheme(themeName);
}
