import { NextResponse } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

// api/theme?name=dark-plus
export default async (req) => {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url);
  const name = url.searchParams.get("name");
  const version = url.searchParams.get("v");
  console.log("fetching theme", name, version);

  const r = await fetch(
    `https://unpkg.com/@code-hike/lighter@${version}/themes/${name}.json`
  );
  const theme = await r.json();

  const res = NextResponse.json(theme);

  res.headers.set("Cache-Control", "s-maxage=1, stale-while-revalidate");
  res.headers.set("Access-Control-Allow-Methods", "GET");
  res.headers.set("Access-Control-Allow-Origin", "*");

  return res;
};
