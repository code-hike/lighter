import { NextResponse } from "next/server";
import { getLanguagesToLoad } from "../../../lib/src/grammars";

export const config = {
  runtime: "edge",
};

// api/grammars?lang=js&v=0.1.8
export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200 });
  }

  const url = new URL(req.url);
  const lang = url.searchParams.get("lang");
  const version = url.searchParams.get("v");
  console.log("fetching grammars", lang, version);

  try {
    const grammars = await getGrammars(lang, version);
    const res = NextResponse.json(grammars);

    res.headers.set("Cache-Control", "s-maxage=1, stale-while-revalidate");
    res.headers.set("Access-Control-Allow-Methods", "GET");
    res.headers.set("Access-Control-Allow-Origin", "*");

    return res;
  } catch (e) {
    console.log("error fetching grammars", e);
    return new Response(e.message, { status: 500 });
  }
};

async function getGrammars(lang, version) {
  const languages = getLanguagesToLoad(lang);
  const grammars = await Promise.all(
    languages.map(async (language) => {
      const r = await fetch(
        `https://unpkg.com/@code-hike/lighter@${version}/grammars/${language.path}`
      );

      if (!r.ok) {
        throw new Error(
          `https://unpkg.com/@code-hike/lighter@${version}/grammars/${language.path} ${r.status} ${r.statusText}`
        );
      }

      const grammar = await r.json();

      grammar.names = [language.id, ...(language.aliases || [])];
      grammar.embeddedLangs = language.embeddedLangs || [];
      return grammar;
    })
  );
  return grammars;
}
