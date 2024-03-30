import { expect, test } from "vitest";
import { blockRegexToRange, inlineRegexToRange } from "./regex-range";

test("block regex range", () => {
  const code = `
function x() {
  console.log(1)
  console.log(2)
  if (true) {
    console.log(3)
  }
}

function y() {
  console.log(1)
}
`.trim();
  const result = blockRegexToRange(code, "(/^ {2}.*(?:\n {2}.*)*/gm)", 1);
  expect(result).toMatchInlineSnapshot(`
    [
      {
        "fromLineNumber": 2,
        "toLineNumber": 6,
      },
      {
        "fromLineNumber": 10,
        "toLineNumber": 10,
      },
    ]
  `);
});

test("block regex range repeated line", () => {
  const code = `
const foo = 1;
const bar = 2
foo = foo + bar;
`.trim();
  const result = blockRegexToRange(code, "(/foo/g)", 1);
  expect(result).toMatchInlineSnapshot(`
    [
      {
        "fromLineNumber": 1,
        "toLineNumber": 1,
      },
      {
        "fromLineNumber": 3,
        "toLineNumber": 3,
      },
    ]
  `);
});

test("inline regex range", () => {
  const code = `
const foo = 1;
const bar = 2
foo = foo + bar;
`.trim();
  const result = inlineRegexToRange(code, "[/foo/g]", 1);

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "fromColumn": 7,
        "lineNumber": 1,
        "toColumn": 9,
      },
    ]
  `);
});

test("inline regex range with capture group", () => {
  const code = `
function C() {
  return <div className="bg-red-500">
    <span className="text-blue-500"><a className="x">Hello</a></span>
  </div>
}
`.trim();
  const result = inlineRegexToRange(code, '[/className="(.*?)"/gm]', 1);

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "fromColumn": 26,
        "lineNumber": 2,
        "toColumn": 35,
      },
      {
        "fromColumn": 22,
        "lineNumber": 3,
        "toColumn": 34,
      },
      {
        "fromColumn": 51,
        "lineNumber": 3,
        "toColumn": 51,
      },
    ]
  `);
});

test("inline regex range with capture group not g", () => {
  const code = `
function C() {
  return <div className="">
    <span className="text-blue-500"><a className="x">Hello</a></span>
  </div>
}
`.trim();
  const result = inlineRegexToRange(code, '[/className="(.*?)"/]', 3);

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "fromColumn": 22,
        "lineNumber": 3,
        "toColumn": 34,
      },
    ]
  `);
});
