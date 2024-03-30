import { test, expect } from "vitest";
import { extractor } from "./extractor";

test("extraction", () => {
  expectExtraction("!foo", ["foo", , ""]);
  expectExtraction("!foo(1)", ["foo", "(1)", ""]);
  expectExtraction("!foo[1]", ["foo", "[1]", ""]);
  expectExtraction("!foo[   ] q q", ["foo", "[   ]", "q q"]);
  expectExtraction("!foo(/bar/)", ["foo", "(/bar/)", ""]);
  expectExtraction("!foo(/bar baz/g) 1 2", ["foo", "(/bar baz/g)", "1 2"]);
  expectExtraction("!Focus(/y/) bar", ["Focus", "(/y/)", "bar"]);
});

function expectExtraction(comment: string, expected: [string, string, string]) {
  const result = extractor(comment);
  const [name, rangeString, query] = expected;
  expect(result).toEqual({ name, rangeString, query });
}
