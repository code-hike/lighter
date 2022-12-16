import { NextResponse } from "next/server";
import { getLanguagesToLoad } from "../../../lib/src/grammars";

export const config = {
  runtime: "experimental-edge",
};

// api/grammars?lang=js
export default async (req) => {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url);
  const lang = url.searchParams.get("lang");
  const version = url.searchParams.get("v");
  console.log("fetching grammars", lang, version);

  const languages = getLanguagesToLoad(lang);

  const grammars = await Promise.all(
    languages.map(async (language) => {
      const r = await fetch(
        `https://unpkg.com/@code-hike/lighter@${version}/grammars/${language.path}`
      );
      const grammar = await r.json();

      grammar.names = [language.id, ...(language.aliases || [])];
      grammar.embeddedLangs = language.embeddedLangs || [];
      return grammar;
    })
  );

  const res = NextResponse.json(grammars);

  res.headers.set("Cache-Control", "s-maxage=1, stale-while-revalidate");
  res.headers.set("Access-Control-Allow-Methods", "GET");
  res.headers.set("Access-Control-Allow-Origin", "*");

  return res;
};
