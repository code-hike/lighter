import { highlight } from "@code-hike/lighter";
import fs from "fs";

highlight("const x", "js").then((tokens) => {
  console.log("default", JSON.stringify(tokens));
});

highlight("const x", "js", "dracula").then((tokens) => {
  console.log("dracula", JSON.stringify(tokens));
});
