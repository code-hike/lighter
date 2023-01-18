import resolveSync from "./resolve";

export async function readJSON(folder: string, filename: string) {
  const fs = await import("fs").then((m) => m.promises);
  const path = await import("path");
  const { URL } = await import("url");
  const __dirname = new URL(".", import.meta.url).pathname;
  try {
    let folderPath = path.resolve(__dirname, "..", folder);
    let filepath = path.resolve(folderPath, filename);
    const result = await fs.readFile(filepath, "utf8");
    if (!result) {
      throw new Error("no results");
    }
    return JSON.parse(result);
  } catch (e) {
    // console.log("using resolve");
    const indexFile = resolveSync("@code-hike/lighter", { basedir: __dirname });
    let folderPath = path.resolve(indexFile, "..", "..", folder);
    let filepath = path.resolve(folderPath, filename);
    return JSON.parse(await fs.readFile(filepath, "utf8"));
  }
}
