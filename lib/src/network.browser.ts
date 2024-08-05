// this will be replaced at build time with the version from package json
const LIGHTER_VERSION = "__LIGHTER_VERSION__";

// endpoints:
// /grammars/${name}.json
// /themes/${name}.json
export async function fetchJSON(endpoint: string) {
  console.warn(
    `Code Hike warning: Fetching resource from network "${endpoint}"`
  );
  const r = await fetch(`https://lighter.codehike.org/${endpoint}.json`);
  // console.log(`https://lighter.codehike.org/${endpoint}.json`, r.status);
  if (!r.ok) {
    return undefined;
  }
  return await r.json();
}
