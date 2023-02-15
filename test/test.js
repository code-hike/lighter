import { annotatedHighlight, extractAnnotations } from "@code-hike/lighter";

// highlight("const x", "js").then((tokens) => {
//   console.log("default", JSON.stringify(tokens));
// });

const code = `
// foo[9:11]
const x = 20
`.trim();
// const code = `// foo `;
const alias = "js";
const theme = "dracula";

async function run() {
  const { code: newCode, annotations } = await extractAnnotations(code, alias, [
    "mark",
    "foo",
    "title",
  ]);

  const result = await annotatedHighlight(newCode, alias, theme, annotations);
  // console.log(JSON.stringify(result.lines));
  console.log(JSON.stringify(result.colors, null, 1));
}

run();
