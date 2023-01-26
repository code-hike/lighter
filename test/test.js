import { annotatedHighlight, extractAnnotations } from "@code-hike/lighter";

// highlight("const x", "js").then((tokens) => {
//   console.log("default", JSON.stringify(tokens));
// });

const test1 = `
const x = 1; /* bar x */ more /* notannotated */ code`;

const code = `
// title mything.ts
console.log("hello");

/* nothing */
// mark[2:5]
const x = 1; // foo x
`;
// const code = `// foo `;
const alias = "js";
const theme = "dracula";

async function run() {
  // try {
  //   const result = await highlight(code, alias, theme);

  //   console.log("dracula", JSON.stringify(result));
  // } catch (e) {
  //   if (e instanceof UnknownLanguageError) {
  //     console.log("Unknown language", e.alias);
  //   } else {
  //     throw e;
  //   }
  // }
  const { code: newCode, annotations } = await extractAnnotations(code, alias, [
    "mark",
    "foo",
    "title",
  ]);

  const result = await annotatedHighlight(newCode, alias, theme, annotations);
  console.log(annotations, newCode);
  // console.log(JSON.stringify(result.lines, null, 1));
}

run();
