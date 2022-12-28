import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { arraybuffer } from "./load-buffer";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";

const pkg = require("./package.json");

export default {
  inlineDynamicImports: true,
  input: "src/index.js",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/index.esm.mjs",
      format: "esm",
    },
  ],
  plugins: [
    replace({
      __LIGHTER_VERSION__: `"${pkg.version}"`,
    }),
    json(),
    nodeResolve(),
    arraybuffer({ include: "**/*.wasm" }),
    commonjs(),
  ],
};
