import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Body = { text?: string; from?: "es" | "en"; to?: "es" | "en" };

async function translateGoogle(text: string, from: "es" | "en", to: "es" | "en"): Promise<string | null> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text.slice(0, 1000))}`;
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!res.ok) return null;
  const json = (await res.json()) as unknown;
  // shape: [[["translated","original",...], ...], ...]
  if (!Array.isArray(json) || !Array.isArray(json[0])) return null;
  const parts = (json[0] as unknown[])
    .map((p) => (Array.isArray(p) && typeof p[0] === "string" ? p[0] : ""))
    .join("");
  return parts.trim() || null;
}

async function translateMyMemory(text: string, from: "es" | "en", to: "es" | "en"): Promise<string | null> {
  const langpair = `${from}|${to}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=${encodeURIComponent(langpair)}`;
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!res.ok) return null;
  const json = (await res.json()) as { responseData?: { translatedText?: string } };
  const translated = json.responseData?.translatedText?.trim();
  return translated || null;
}

export async function POST(req: Request) {
  try {
    const { text, from, to } = (await req.json()) as Body;
    const value = (text ?? "").trim();
    if (!value) return NextResponse.json({ text: "" });
    if (!from || !to || from === to) return NextResponse.json({ text: value });

    const translated =
      (await translateGoogle(value, from, to).catch(() => null)) ??
      (await translateMyMemory(value, from, to).catch(() => null));

    if (!translated) return NextResponse.json({ error: "Sin traducción" }, { status: 502 });
    return NextResponse.json({ text: translated });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
