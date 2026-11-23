import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Extracted = {
  name: string;
  description: string;
  imageUrl: string;
  store: "Amazon" | "AliExpress" | "";
  priceNote: string;
  affiliateUrl: string;
};

function pickMeta(html: string, patterns: RegExp[]): string {
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return "";
}

function decodeHtml(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function detectStore(url: string): "Amazon" | "AliExpress" | "" {
  try {
    const h = new URL(url).hostname.toLowerCase();
    if (h.includes("amazon.")) return "Amazon";
    if (h.includes("aliexpress.")) return "AliExpress";
  } catch {}
  return "";
}

function withAmazonTag(url: string, tag: string) {
  try {
    const u = new URL(url);
    if (u.hostname.toLowerCase().includes("amazon.")) {
      u.searchParams.set("tag", tag);
    }
    return u.toString();
  } catch {
    return url;
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { url?: string };
    const rawUrl = (body.url ?? "").trim();
    if (!rawUrl) return NextResponse.json({ error: "Missing url" }, { status: 400 });

    let url: URL;
    try {
      url = new URL(rawUrl);
    } catch {
      return NextResponse.json({ error: "Invalid url" }, { status: 400 });
    }

    const store = detectStore(url.toString());
    const affiliateUrl =
      store === "Amazon"
        ? withAmazonTag(url.toString(), process.env.AMAZON_TAG ?? "0noxtackore-20")
        : url.toString();

    const res = await fetch(url.toString(), {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "accept-language": "es-ES,es;q=0.9,en;q=0.8",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });

    const html = await res.text();
    const title = decodeHtml(
      pickMeta(html, [
        /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
        /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:title["']/i,
        /<title[^>]*>([^<]+)<\/title>/i,
      ]),
    );
    const description = decodeHtml(
      pickMeta(html, [
        /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i,
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i,
      ]),
    );
    const imageUrl = decodeHtml(
      pickMeta(html, [
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
        /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
      ]),
    );

    const priceNote =
      store === "Amazon" ? "Precio en Amazon / Price on Amazon" : store === "AliExpress" ? "Precio en AliExpress / Price on AliExpress" : "";

    const data: Extracted = {
      name: title.slice(0, 160),
      description: description.slice(0, 300),
      imageUrl,
      store,
      priceNote,
      affiliateUrl,
    };

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ error: "Extraction failed", detail: String(err) }, { status: 500 });
  }
}
