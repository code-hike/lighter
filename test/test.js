import { highlightWithScopes } from "@code-hike/lighter";

// highlight("const x", "js").then((tokens) => {
//   console.log("default", JSON.stringify(tokens));
// });

const code = `
const x = 20
`.trim();
// const code = `// foo `;
const alias = "js";
const theme = "dracula";

async function run() {
  const result = await highlightWithScopes(code, alias, theme);
  // console.log(JSON.stringify(result.lines));
  // console.log(result.lines[0].map((t) => `${t.style?.color} ${t.content}`));
  table(
    result.lines[0].map((t) => ({
      t: t.content,
      c: t.style.color,
      s: t.scopes.join(" ").slice(0, 24),
    }))
  );
}

import { Console } from "console";
import { Transform } from "stream";

function table(input) {
  // @see https://stackoverflow.com/a/67859384
  const ts = new Transform({
    transform(chunk, enc, cb) {
      cb(null, chunk);
    },
  });
  const logger = new Console({ stdout: ts });
  logger.table(input);
  const table = (ts.read() || "").toString();
  let result = "";
  for (let row of table.split(/[\r\n]+/)) {
    let r = row.replace(/[^┬]*┬/, "┌");
    r = r.replace(/^├─*┼/, "├");
    r = r.replace(/│[^│]*/, "");
    r = r.replace(/^└─*┴/, "└");
    r = r.replace(/'/g, " ");
    result += `${r}\n`;
  }
  console.log(result);
}

run();
