import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { arraybuffer } from "./load-buffer";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";

const pkg = require("./package.json");

export default {
  input: "src/index.ts",
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
      __LIGHTER_VERSION__: `${pkg.version}`,
      preventAssignment: false,
    }),
    json(),
    typescript(),
    nodeResolve(),
    arraybuffer({ include: "**/*.wasm" }),
    commonjs(),
  ],
};
