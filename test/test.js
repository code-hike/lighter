import { highlight } from "../lib/dist/index.esm.mjs";
import fs from "fs";

const theme = JSON.parse(
  fs.readFileSync("../lib/themes/GitHubLight.json", "utf8")
);

highlight("const x", "js", theme).then((tokens) => {
  console.log(JSON.stringify(tokens));
});
