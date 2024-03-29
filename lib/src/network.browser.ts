// this will be replaced at build time with the version from package json
const LIGHTER_VERSION = "__LIGHTER_VERSION__";

// endpoints:
// /grammars/${name}.json
// /themes/${name}.json
export async function fetchJSON(endpoint: string) {
  const r = await fetch(`https://lighter.codehike.org/${endpoint}.json`);
  return await r.json();
}
