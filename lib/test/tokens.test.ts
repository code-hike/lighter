import { expect, test } from "vitest";
import { highlight } from "..";

test.only("remove empty space tokens", async () => {
  const code = `export default   function Gallery() {

  }`;
  const result = await highlight(code, "js", "github-dark");
  expect(result.lines).toMatchSnapshot();
});
