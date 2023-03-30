// this will be replaced at build time with the version from package json
const LIGHTER_VERSION = "__LIGHTER_VERSION__";

// endpoints:
// /grammars/${name}.json
// /themes/${name}.json
export async function fetchJSON(endpoint: string) {
  if (typeof fetch === "function") {
    // console.log(`using fetch`, `https://lighter.codehike.org/${endpoint}.json`);
    const r = await fetch(`https://lighter.codehike.org/${endpoint}.json`);
    return await r.json();
  }
  // console.log(`using https`, `https://lighter.codehike.org/${endpoint}.json`);

  const https = await import("https");
  const options = {
    host: "lighter.codehike.org",
    path: `/${endpoint}.json`,
    method: "GET",
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(JSON.parse(data));
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}
