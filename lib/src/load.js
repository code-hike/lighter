import { readJSON } from "./file-system";
import { fetchJSON } from "./network.js";

const themeCache = new Map();

export async function loadTheme(name) {
  if (themeCache.has(name)) {
    return themeCache.get(name);
  }

  try {
    const loadedTheme = await readJSON("themes", name + ".json");
    themeCache.set(name, loadedTheme);
    return loadedTheme;
  } catch (e) {
    return await fetchJSON(`theme?name=${name}`);
  }
}
