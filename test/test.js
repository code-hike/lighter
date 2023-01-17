import { highlight, UnknownLanguageError } from "@code-hike/lighter";

// highlight("const x", "js").then((tokens) => {
//   console.log("default", JSON.stringify(tokens));
// });

const code = `
~~~js
const re = /ab+c/;
~~~`;
const alias = "md";
const theme = "dracula";

async function run() {
  try {
    const result = await highlight(code, alias, theme);

    console.log("dracula", JSON.stringify(result));
  } catch (e) {
    if (e instanceof UnknownLanguageError) {
      console.log("Unknown language", e.alias);
    } else {
      throw e;
    }
  }
}

run();
