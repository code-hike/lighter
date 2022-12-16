import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { arraybuffer } from "./load-buffer";

export default {
  input: "src/index.js",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [nodeResolve(), arraybuffer({ include: "**/*.wasm" }), commonjs()],
};
