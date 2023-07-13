import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { arraybuffer } from "./load-buffer";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";

const pkg = require("./package.json");

const plugins = [
  replace({ __LIGHTER_VERSION__: `${pkg.version}`, preventAssignment: false }),
  json(),
  nodeResolve(),
  typescript({
    tsconfigDefaults: { compilerOptions: { module: "esnext" } },
  }),
  arraybuffer({ include: "**/*.wasm" }),
];

export default [
  {
    input: "src/index.ts",
    output: [
      { file: "dist/index.cjs.js", format: "cjs" },
      { file: "dist/index.esm.mjs", format: "esm" },
    ],
    plugins,
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/browser.esm.mjs", format: "esm" }],
    plugins: [
      replace({
        "./file-system": "./file-system.browser",
        "./network": "./network.browser",
        delimiters: ["", "\\b"],
        preventAssignment: false,
      }),
      ...plugins,
    ],
  },
  {
    input: "./src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
