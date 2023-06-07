---
"@code-hike/lighter": minor
---

Extract theme colors to a different function

Breaking Changes:

- `highlightWithScopes` removed, use `highlight` instead
- `annotatedHighlight` removed, use `highlight` instead
- `colors` removed from `highlight` result, now `style` is returned instead (only with `style.background` and `style.color` properties, the rest of the colors are returned by `getThemeColors` function)
