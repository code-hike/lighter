import { highlight } from "@code-hike/lighter";

const { lines, style } = await highlight(
  /* code  */ "print('hello')",
  /* lang  */ "py",
  /* theme */ "github-dark"
);

// base foreground and background
const { color, background } = style;

console.log(color, background);
console.log(lines);
