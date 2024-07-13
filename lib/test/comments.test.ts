import { describe, expect, test } from "vitest";
import { extractAnnotations, highlight } from "..";
let codes = [
  // Single-line comment using //
  ["// foo", "actionscript-3"],
  ["// foo", "apex"],
  ["// foo", "c#"],
  ["// foo", "cpp"],
  ["// foo", "cs"],
  ["// foo", "csharp"],
  ["// foo", "dart"],
  ["// foo", "f#"],
  ["// foo", "go"],
  ["// foo", "groovy"],
  ["// foo", "java"],
  ["// foo", "javascript"],
  ["// foo", "js"],
  ["// foo", "jsx"],
  ["// foo", "less"],
  ["// foo", "objective-c"],
  ["// foo", "objective-cpp"],
  ["// foo", "rust"],
  ["// foo", "scala"],
  ["// foo", "swift"],
  ["// foo", "typescript"],
  ["// foo", "ts"],
  ["// foo", "tsx"],
  ["// foo", "verilog"],
  ["// foo", "wgsl"],
  ["// foo", "jison"],
  ["// foo", "jsonnet"],
  ["// foo", "kql"],
  ["// foo", "zenscript"],
  ["// foo", "kusto"],

  // Single-line comment using #
  ["# foo", "asm"],
  ["# foo", "bash"],
  ["# foo", "coffee"],
  ["# foo", "crystal"],
  ["# foo", "docker"],
  ["# foo", "dockerfile"],
  ["# foo", "elixir"],
  ["# foo", "fish"],
  ["# foo", "gdscript"],
  ["# foo", "graphql"],
  ["# foo", "http"],
  ["# foo", "ini"],
  ["# foo", "julia"],
  ["# foo", "make"],
  ["# foo", "makefile"],
  ["# foo", "perl"],
  ["# foo", "perl6"],
  ["# foo", "python"],
  ["# foo", "py"],
  ["# foo", "r"],
  ["# foo", "raku"],
  ["# foo", "shell"],
  ["# foo", "shellscript"],
  ["# foo", "tcl"],
  ["# foo", "toml"],
  ["# foo", "txt"],
  ["# foo", "yaml"],
  ["# foo", "yml"],
  ["# foo", "zsh"],
  ["# foo", "turtle"],

  // Single-line comment using ;
  ["; foo", "lisp"],
  ["; foo", "clj"],
  ["; foo", "clojure"],
  ["; foo", "scheme"],
  [`" foo"`, "smalltalk"],

  // Single-line comment using --
  ["-- foo", "ada"],
  ["-- foo", "haskell"],
  ["-- foo", "sql"],
  ["-- foo", "lua"],

  // Single-line comment using %
  ["% foo", "matlab"],
  ["% foo", "tex"],

  // Special single-line comment formats
  ["{ foo}", "pascal"],
  ["# foo", "sh"],
  ["# foo", "sparql"],
  ["# foo", "shell"],
  ["# foo", "sh"],
  ["# foo", "tcl"],
  ["<!-- foo-->", "vue-html"],
  ["* foo", "abap"],
  ["; foo", "beancount"],
  ["' foo", "vb"],
  ["<!-- foo-->", "html"],

  // more
  ["#  foo", "imba"],
  ["// foo", "kotlin"],
  ["; foo", "clj"],
  ["; foo", "clojure"],
  ["% foo", "erl"],
  ["<%# foo%>", "erb"],
  ["% foo", "erlang"],
  ["// foo", "glimmer-js"],
  ["// foo", "glimmer-ts"],
  ["; foo", "reg"],
  ["* foo", "stata"],
  [`" foo`, "vim"],
  [`" foo`, "viml"],
  [`" foo`, "vimscript"],
  ["// foo", "hlsl"],
  ["# foo", "berry"],
  ["// foo", "cypher"],
  ["-- foo", "elm"],
  ["# foo", "nix"],
  ["// foo", "solidity"],
  ["REM foo", "bat"],
  ["REM foo", "batch"],
  ["// foo", "shader"],
  ["// foo", "shaderlab"],
  ["* foo", "sas"],

  // fail
  // ["// foo", "apl"],
  // ["# foo", "shellsession"],
  // ["(* foo *)", "ocaml"],
];

// codes = [
//   // test
//   ["// foo", "actionscript-3"],
// ];

describe.each(codes)("extract annotations", (code, lang) => {
  test(lang, async () => {
    let comments = [];
    const extracted = await extractAnnotations(code, lang, (comment) => {
      comments.push(comment);
      return null;
    });

    // if (comments.length === 0) {
    //   const h = await highlight(extracted.code, lang, "dark-plus", {
    //     scopes: true,
    //   });
    //   const line = h.lines[0];
    //   if (line.length == 1) {
    //     const token = line[0];
    //     if (token.scopes[0].startsWith("comment.line")) {
    //       console.log(lang, token.content, token.scopes);
    //     } else {
    //       console.log(lang, token.content, token.scopes);
    //     }
    //   } else {
    //     console.log(line);
    //     // TODO fix this
    //   }
    // }

    // const h = await highlight(extracted.code, lang, "dark-plus", {
    //   scopes: true,
    // });
    // const line = h.lines[0];
    // console.log(line);

    expect(comments).toHaveLength(1);
    expect(comments[0]).toBe(" foo");
  });
});
