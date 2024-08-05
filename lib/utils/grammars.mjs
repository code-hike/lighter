import { grammars } from "tm-grammars";

const all = [
  ...grammars.map((g) => ({
    ...g,
    importPath: `tm-grammars/grammars/${g.name}.json`,
  })),
  {
    name: "txt",
    scopeName: "source.txt",
    importPath: "../tm-grammars/txt.json",
  },
];

all.sort((a, b) => a.name.localeCompare(b.name));

export default all;
