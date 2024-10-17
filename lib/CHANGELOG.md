# @code-hike/lighter

## 1.0.1

### Patch Changes

- b285910: Add `colorScheme` to style

## 1.0.0

### Major Changes

- b6ec951: Drop CJS and use dynamic imports for grammars

### Patch Changes

- Add warning message when using network

## 1.0.0-beta.0

### Major Changes

- Drop CJS and use dynamic imports for grammars

## 0.9.4

### Patch Changes

- 4d60826: Fix indented comments

## 0.9.3

### Patch Changes

- 332a0e8: Add polar grammar

## 0.9.2

### Patch Changes

- e2c59bd: Better comment detection

## 0.9.1

### Patch Changes

- 87a94c0: Add regex annotations

## 0.9.0

### Minor Changes

- 567aadb: Add annotation extractor function

### Patch Changes

- 677d2d8: Remove JSX comment wrapper

## 0.8.2

### Patch Changes

- 8ceee96: Add terminal highlighting

## 0.8.1

### Patch Changes

- a9fae6e: Add activeBorderTop color

## 0.8.0

### Minor Changes

- bf83084: Add edge bundle

## 0.7.4

### Patch Changes

- 24563e6: Remove dynamic import from browser bundle

## 0.7.3

### Patch Changes

- c676a69: Better mdx comment annotations

  - remove `{}` after extracting the annotation

## 0.7.2

### Patch Changes

- b701e70: Update grammars

  - Update all grammars
  - Add txt grammar for text with comments
  - Add text to the list of LANG_NAMES

## 0.7.1

### Patch Changes

- def601e: Add getThemeColorsSync

## 0.7.0

### Minor Changes

- 9f4d748: Extract theme colors to a different function

  Breaking Changes:

  - `highlightWithScopes` removed, use `highlight` instead
  - `annotatedHighlight` removed, use `highlight` instead
  - `colors` removed from `highlight` result, now `style` is returned instead (only with `style.background` and `style.color` properties, the rest of the colors are returned by `getThemeColors` function)

## 0.6.7

### Patch Changes

- 7257e74: Support css variables

## 0.6.6

### Patch Changes

- 28d5da1: Fix frozen themes again

## 0.6.5

### Patch Changes

- b797dc1: Fix error when theme is frozen

## 0.6.4

### Patch Changes

- 8a857ff: Add highlightSync

## 0.6.3

### Patch Changes

- 8b0eeb4: Join tokens when possible

## 0.6.2

### Patch Changes

- bc57e68: Fix text annotations

## 0.6.1

### Patch Changes

- ee37d6d: Add text grammar

## 0.6.0

### Minor Changes

- 3a1d920: Read grammars and themes from public folder when using network

## 0.5.2

### Patch Changes

- dad4be4: Update grammars
- 0437455: Export theme and lang names

## 0.5.1

### Patch Changes

- 2433479: Add highlight with scopes

## 0.5.0

### Minor Changes

- 4111eb7: Add browser export without file-system

## 0.4.1

### Patch Changes

- 06459bf: Add more colors

## 0.4.0

### Minor Changes

- 5053678: Add more theme colors

## 0.3.4

### Patch Changes

- d9abe7b: Fix one char tokens

## 0.3.3

### Patch Changes

- 1983108: Better annotation splitting

## 0.3.2

### Patch Changes

- e5b4473: Fix token splitting

## 0.3.1

### Patch Changes

- dadb687: Fix annotation nesting

## 0.3.0

### Minor Changes

- 198900c: Add annotations

## 0.2.6

### Patch Changes

- 1abaf99: Remove path-parse dep

## 0.2.5

### Patch Changes

- 91111f8: Fix wrong theme usage

## 0.2.4

### Patch Changes

- eccf1a2: Export more types

## 0.2.3

### Patch Changes

- d50eedb: Add missing grammar dependency
- bb84fce: Update grammars
- fa82451: Better theme cache

## 0.2.2

### Patch Changes

- 38d0970: Better theme types

## 0.2.1

### Patch Changes

- fe1ebb8: Add unknown language error

## 0.2.0

### Minor Changes

- 3ae2337: Remove logs

## 0.1.9

### Patch Changes

- 65e9b5d: Better error handling

## 0.1.8

### Patch Changes

- 7d501df: Remove theme from bundle

## 0.1.7

### Patch Changes

- d3208da: Add tabs colors

## 0.1.6

### Patch Changes

- 466ba9a: Fix resolve imports

## 0.1.5

### Patch Changes

- a112aa0: Improve promise cache

## 0.1.4

### Patch Changes

- b2af740: Load grammars once

## 0.1.3

### Patch Changes

- bca305e: Better parallelism

## 0.1.2

### Patch Changes

- b73d1b7: Test commit

## 0.1.1

### Patch Changes

- 3db1e24: Test
