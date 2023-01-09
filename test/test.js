import { highlight } from "@code-hike/lighter";

// highlight("const x", "js").then((tokens) => {
//   console.log("default", JSON.stringify(tokens));
// });

highlight(
  `
~~~js
const re = /ab+c/;
~~~`,
  "vue",
  "dracula"
).then((tokens) => {
  console.log("dracula", JSON.stringify(tokens));
});
