import { NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

// api/theme?name=dark-plus&v=0.1.8
export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200 });
  }

  const url = new URL(req.url);
  const name = url.searchParams.get("name");
  const version = url.searchParams.get("v");
  console.log("fetching theme", name, version);

  try {
    const r = await fetch(
      `https://unpkg.com/@code-hike/lighter@${version}/themes/${name}.json`
    );

    if (!r.ok) {
      throw new Error(
        `https://unpkg.com/@code-hike/lighter@${version}/themes/${name}.json ${r.status} ${r.statusText}`
      );
    }

    const theme = await r.json();

    const res = NextResponse.json(theme);

    res.headers.set("Cache-Control", "s-maxage=1, stale-while-revalidate");
    res.headers.set("Access-Control-Allow-Methods", "GET");
    res.headers.set("Access-Control-Allow-Origin", "*");

    return res;
  } catch (e) {
    console.log("error fetching theme", e);
    return new Response(e.message, { status: 500 });
  }
};
