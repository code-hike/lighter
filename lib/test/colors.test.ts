import { expect, test } from "vitest";
import { getThemeColors } from "..";

test("get theme colors from theme name", async () => {
  const result = await getThemeColors("github-dark");
  expect(result).toMatchSnapshot();
});

test("get theme colors from theme name from-css", async () => {
  const result = await getThemeColors("github-from-css");
  expect(result).toMatchSnapshot();
});

test("get theme colors from theme undefined", async () => {
  expect(getThemeColors(undefined)).rejects.toThrow();
});

test("get theme colors from unknown theme", async () => {
  expect(getThemeColors("unknown-theme" as any)).rejects.toThrow();
});

test("get theme colors from empty theme", async () => {
  const result = await getThemeColors({});
  expect(result).toMatchSnapshot();
});
