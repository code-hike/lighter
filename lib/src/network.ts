// this will be replaced at build time with the version from package json
const LIGHTER_VERSION = "__LIGHTER_VERSION__";

// endpoints:
// grammars?lang=${langId}
// theme?name=${name}
export async function fetchJSON(endpoint: string) {
  if (typeof fetch === "function") {
    // console.log(
    //   `using fetch`,
    //   `https://lighter.codehike.org/api/${endpoint}&v=${LIGHTER_VERSION}`
    // );
    const r = await fetch(
      `https://lighter.codehike.org/api/${endpoint}&v=${LIGHTER_VERSION}`
    );
    return await r.json();
  }
  // console.log(
  //   `using https`,
  //   `https://lighter.codehike.org/api/${endpoint}&v=${LIGHTER_VERSION}`
  // );

  const https = await import("https");
  const options = {
    host: "lighter.codehike.org",
    path: `/api/${endpoint}&v=${LIGHTER_VERSION}`,
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
