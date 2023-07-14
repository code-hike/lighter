import nodeResolve from "@rollup/plugin-node-resolve";
import { arraybuffer } from "./load-buffer";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";

const pkg = require("./package.json");

const plugins = [
  replace({ __LIGHTER_VERSION__: `${pkg.version}`, preventAssignment: false }),
  json(),
  nodeResolve(),
  typescript({
    tsconfigDefaults: { compilerOptions: { module: "esnext" } },
  }),
  arraybuffer({ include: "**/*.wasm" }),
  // terser(),
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
    output: [{ file: "dist/worker.esm.mjs", format: "esm" }],
    external: ["./onig.wasm?module"],
    plugins: [
      replace({
        "./file-system": "./file-system.browser",
        "./network": "./network.browser",
        "./wasm": "./wasm.worker",
        delimiters: ["", "\\b"],
        preventAssignment: false,
      }),
      ...plugins,
    ],
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
