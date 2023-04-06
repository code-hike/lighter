import { expect, test } from "vitest";
import { highlight } from "..";

test("highlight with scopes", async () => {
  const code = `export default   function Gallery() {

  }`;
  const result = await highlight(code, "js", "github-dark", { scopes: true });
  expect(result.lines).toMatchSnapshot();
});
