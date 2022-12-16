import { highlight } from "../lib/dist/index.js";
import fs from "fs";

const theme = JSON.parse(
  fs.readFileSync("../lib/themes/GitHubLight.json", "utf8")
);

highlight("hello *w*", "md", theme).then((tokens) => {
  console.log(JSON.stringify(tokens));
});
