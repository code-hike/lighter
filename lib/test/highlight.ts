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

  test("highlight js", async () => {
    const result = await highlight("x = 1", "js");
    expect(result).toMatchSnapshot();
  });
}
