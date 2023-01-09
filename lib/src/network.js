// endpoints:
// grammars?lang=${alias}
// theme?name=${name}
export async function fetchJSON(endpoint) {
  if (typeof fetch === "function") {
    console.log(
      `using fetch`,
      `https://lighter.codehike.org/api/${endpoint}&v=${__LIGHTER_VERSION__}`
    );
    const r = await fetch(
      `https://lighter.codehike.org/api/${endpoint}&v=${__LIGHTER_VERSION__}`
    );
    return await r.json();
  }
  console.log(
    `using https`,
    `https://lighter.codehike.org/api/${endpoint}&v=${__LIGHTER_VERSION__}`
  );

  const https = await import("https");
  const options = {
    host: "lighter.codehike.org",
    path: `/api/${endpoint}&v=${__LIGHTER_VERSION__}`,
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
