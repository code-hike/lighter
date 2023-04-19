import { expect, test } from "vitest";

export function runTests({ highlight }) {
  test("null code", async () => {
    const result = await highlight(null, "js");
    expect(result).toMatchSnapshot();
  });

  test("null lang", async () => {
    const result = await highlight("x = 1", null);
    expect(result).toMatchSnapshot();
  });

  test("wrong code type", async () => {
    expect(highlight({}, null)).rejects.toThrow();
  });

  test("wrong lang type", async () => {
    expect(highlight("x = 1", {})).rejects.toThrow();
  });

  test("unknown lang", async () => {
    expect(highlight("x = 1", "not-a-lang")).rejects.toThrow();
  });

  test("highlight js", async () => {
    const result = await highlight("x = 1", "js");
    expect(result).toMatchSnapshot();
  });

  test("highlight html with theme", async () => {
    const result = await highlight(
      "<script> const x = 1 </script>",
      "html",
      "github-dark"
    );
    expect(result).toMatchSnapshot();
  });

  test("highlight with empty theme", async () => {
    const result = await highlight("x = 1", "js", {});
    expect(result).toMatchSnapshot();
  });

  test("highlight with frozen theme", async () => {
    const theme = Object.freeze({
      tokenColors: Object.freeze([
        { scope: ["comment"], settings: { foreground: "#8b949e" } },
      ]),
    });
    const result = await highlight("x = 1", "js", theme);
    expect(result).toMatchSnapshot();
  });

  test("highlight with scopes", async () => {
    const result = await highlight("x = 1", "js", "github-dark", {
      scopes: true,
    });
    expect(result).toMatchSnapshot();
  });

  test("highlight text", async () => {
    const result = await highlight("x = 1", "text");
    expect(result).toMatchSnapshot();
  });

  test("highlight with unknown theme name", async () => {
    expect(highlight("x = 1", "js", "unknown-theme")).rejects.toThrow();
  });
}
