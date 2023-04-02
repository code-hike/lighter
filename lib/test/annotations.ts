import { expect, test } from "vitest";

export function runAnnotationTests({ extractAnnotations, highlight }) {
  test("extract annottations", async () => {
    const code = `
const x = 1;
// foo
const y = 2;`.trim();

    const result = await extractAnnotations(code, "js", ["foo"]);
    expect(result).toMatchSnapshot();
    const hResult = await highlight(result.code, "js", "dark-plus", {
      annotations: result.annotations,
    });
    expect(hResult).toMatchSnapshot();
  });

  test("extract annottations from text", async () => {
    const code = `
const x = 1;
// foo[3:5]
const y = 2;`.trim();

    const result = await extractAnnotations(code, "text", ["foo"]);
    expect(result).toMatchSnapshot();
    const hResult = await highlight(result.code, "text", "dark-plus", {
      annotations: result.annotations,
    });
    expect(hResult).toMatchSnapshot();
  });
}
