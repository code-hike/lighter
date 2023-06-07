The syntax highlighter used by Code Hike.

## Usage

```js
import { highlight } from "@code-hike/lighter";

const { lines, style } = await highlight(
  /* code  */ "print('hello')",
  /* lang  */ "py",
  /* theme */ "github-dark"
);

// base foreground and background
const { color, background } = style;

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

For **dark/light theme support with CSS** see [#25](https://github.com/code-hike/lighter/pull/25)

For more theme colors (like line number foreground, selection background, etc.):

```js
import { getThemeColors } from "@code-hike/lighter";

const themeColors = await getThemeColors("material-darker");
```

## Credits

- Using [vscode-oniguruma](https://github.com/microsoft/vscode-oniguruma) for highlighting
- **Heavily inspired by [Shiki](https://github.com/shikijs/shiki)** and adapted to Code Hike needs.
- Some more inspiration from [starry-night](https://github.com/wooorm/starry-night)
- Grammars and some themes come from [Shiki](https://github.com/shikijs/shiki), which pulls them from different sources.

```

```
