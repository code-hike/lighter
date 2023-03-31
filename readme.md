The syntax highlighter used by Code Hike.

## Usage

```js
import { highlight } from "@code-hike/lighter";

const { lines, colors } = await highlight(
  /* code  */ "print('hello')",
  /* lang  */ "py",
  /* theme */ "github-dark"
);
const { foreground, background } = colors;

console.log(lines);
```

Output:

```json
[
  [
    { "style": { "color": "#79C0FF" }, "content": "print" },
    { "style": { "color": "#C9D1D9" }, "content": "(" },
    { "style": { "color": "#A5D6FF" }, "content": "'hello'" },
    { "style": { "color": "#C9D1D9" }, "content": ")" }
  ]
]
```

## Credits

- Using [vscode-oniguruma](https://github.com/microsoft/vscode-oniguruma) for highlighting
- **Heavily inspired by [Shiki](https://github.com/shikijs/shiki)** and adapted to Code Hike needs.
- Some more inspiration from [starry-night](https://github.com/wooorm/starry-night)
- Grammars and some themes come from [Shiki](https://github.com/shikijs/shiki), which pulls them from different sources.

```

```
