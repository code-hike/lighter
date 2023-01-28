import { annotatedHighlight, extractAnnotations } from "@code-hike/lighter";

// highlight("const x", "js").then((tokens) => {
//   console.log("default", JSON.stringify(tokens));
// });

const test1 = `
const x = 1; /* bar x */ more /* notannotated */ code`;

const code = `
// mark(2:3) first
// mark(1:2) second
foo1
foo2
foo3
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
  console.log(JSON.stringify(result.lines, null, 1));
}

run();

const x = [
  {
    lineNumber: 1,
    tokens: [
      {
        content: "console.",
        style: {
          color: "#F8F8F2",
        },
      },
      {
        content: "log",
        style: {
          color: "#50FA7B",
        },
      },
      {
        content: "(",
        style: {
          color: "#F8F8F2",
        },
      },
      {
        content: "1",
        style: {
          color: "#BD93F9",
        },
      },
      {
        content: ")",
        style: {
          color: "#F8F8F2",
        },
      },
    ],
  },
  {
    lineNumber: 2,
    tokens: [
      {
        annotationName: "mark",
        annotationQuery: "",
        fromColumn: 4,
        toColumn: 7,
        tokens: [
          {
            content: "console.",
            style: {
              color: "#F8F8F2",
            },
          },
          {
            content: "console.",
            style: {
              color: "#F8F8F2",
            },
          },
          {
            content: "log",
            style: {
              color: "#50FA7B",
            },
          },
          {
            content: "(",
            style: {
              color: "#F8F8F2",
            },
          },
          {
            content: "2",
            style: {
              color: "#BD93F9",
            },
          },
          {
            content: ")",
            style: {
              color: "#F8F8F2",
            },
          },
        ],
      },
    ],
  },
];
