import { highlight } from "@code-hike/lighter";

const theme = "dracula";

const codes = [
  { code: `const x = 20`, alias: "js" },
  { code: `print(10)`, alias: "py" },
  { code: `.foo { color: red }`, alias: "css" },
  { code: `<div>foo</div>`, alias: "html" },
  { code: `# hello`, alias: "md" },
  { code: `class Foo`, alias: "rb" },
  { code: `class Foo`, alias: "java" },
  { code: `function foo()`, alias: "ts" },
];

async function test() {
  for (let i = 0; i < 200000; i++) {
    const { code, alias } = codes[i % codes.length];
    await highlight(code, alias, theme);
    if (i % 10000 === 0) {
      const usage = process.memoryUsage();
      console.log(
        `${i} ${Math.round(usage.rss / 1000000)} ${Math.round(
          usage.heapUsed / 1000000
        )} ${Math.round(usage.heapTotal / 1000000)} ${Math.round(
          usage.external / 1000000
        )}`
      );
    }
  }
}

test();
