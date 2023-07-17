// @ts-ignore
import onig from "./onig.wasm?module";

const instantiator = (importsObject) =>
  WebAssembly.instantiate(onig, importsObject).then((instance) => ({
    instance,
  }));

export default { instantiator };
