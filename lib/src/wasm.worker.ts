// @ts-ignore
import onig from "vscode-oniguruma/release/onig.wasm?module";

const instantiator = (importsObject) =>
  WebAssembly.instantiate(onig, importsObject).then((instance) => ({
    instance,
  }));

export default { instantiator };
