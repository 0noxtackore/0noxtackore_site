import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Body = { text?: string; from?: "es" | "en"; to?: "es" | "en" };

export async function POST(req: Request) {
  try {
    const { text, from, to } = (await req.json()) as Body;
    const value = (text ?? "").trim();
    if (!value) return NextResponse.json({ text: "" });
    if (!from || !to || from === to) return NextResponse.json({ text: value });

    const langpair = `${from}|${to}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(value.slice(0, 500))}&langpair=${encodeURIComponent(langpair)}`;
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!res.ok) return NextResponse.json({ error: `HTTP ${res.status}` }, { status: 502 });
    const json = (await res.json()) as { responseData?: { translatedText?: string } };
    const translated = json.responseData?.translatedText?.trim();
    if (!translated) return NextResponse.json({ error: "Sin traducción" }, { status: 502 });
    return NextResponse.json({ text: translated });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
