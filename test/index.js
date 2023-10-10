import { highlight } from "@code-hike/lighter";

let code = `
[42m [30mastro[39m [0m  [32;1mv2.9.2[0m [1mLaunch sequence.[18B[40D[0m[?2004h
[32m✔[0m  [32mTemplate copied[8B[3D[0m
[2mNo
[0m      [36m◼[0m  [36mNo problem![10B[18D[0m[?2004h
`.trim();
// code = "foo";
const result = await highlight(code, "terminal", "github-dark");
