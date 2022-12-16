import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { arraybuffer } from "./load-buffer";
import replace from "@rollup/plugin-replace";

const pkg = require("./package.json");

export default {
  input: "src/index.js",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [
    replace({
      __LIGHTER_VERSION__: `"${pkg.version}"`,
    }),
    nodeResolve(),
    arraybuffer({ include: "**/*.wasm" }),
    commonjs(),
  ],
};
