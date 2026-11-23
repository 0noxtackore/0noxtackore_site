import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Extracted = {
  name: string;
  description: string;
  imageUrl: string;
  store: "Amazon" | "AliExpress" | "";
  priceNote: string;
  affiliateUrl: string;
  source: "direct" | "wayback" | "scraperapi";
  warning?: string;
};

type FetchResult = { html: string; error?: string };

const CHROME_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

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
    .replace(/&apos;/g, "'")
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

async function fetchText(target: string, timeoutMs: number): Promise<FetchResult> {
  try {
    const res = await fetch(target, {
      headers: {
        "user-agent": CHROME_UA,
        "accept-language": "es-ES,es;q=0.9,en;q=0.8",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return { html: "", error: `HTTP ${res.status}` };
    return { html: await res.text() };
  } catch (err) {
    return { html: "", error: err instanceof Error ? err.message : String(err) };
  }
}

/** Detecta páginas anti-bot / vacías en lugar de tratarlas como éxito. */
function looksBlocked(html: string, originalUrl: string): boolean {
  if (!html || html.length < 1500) return true;
  if (
    /robot check|captcha-form|automated access|sorry! something went wrong|unusual traffic from your computer network|access denied|please verify you are a human/i.test(
      html,
    )
  ) {
    return true;
  }
  let host = "";
  try {
    host = new URL(originalUrl).hostname.toLowerCase();
  } catch {
    return false;
  }
  if (host.includes("amazon.")) {
    return !/id=["']productTitle["']|property=["']og:title["']/.test(html);
  }
  if (host.includes("aliexpress.")) {
    return !/property=["']og:title["']|window\.runParams|__NEXT_DATA__/.test(html);
  }
  return false;
}

/** Copia archivada en archive.org (fallback gratis cuando el fetch directo está bloqueado). */
async function fetchViaWayback(originalUrl: string): Promise<FetchResult & { date?: string }> {
  try {
    const avail = await fetch(
      `https://archive.org/wayback/available?url=${encodeURIComponent(originalUrl)}`,
      { cache: "no-store", signal: AbortSignal.timeout(7000) },
    );
    if (!avail.ok) return { html: "", error: `availability HTTP ${avail.status}` };
    const json = (await avail.json()) as {
      archived_snapshots?: { closest?: { url?: string; timestamp?: string } };
    };
    const snap = json.archived_snapshots?.closest;
    if (!snap?.url) return { html: "", error: "sin copia archivada" };
    const idUrl = snap.url.replace(/\/web\/(\d+)\//, "/web/$1id_/");
    const { html, error } = await fetchText(idUrl, 12000);
    return { html, error, date: snap.timestamp };
  } catch (err) {
    return { html: "", error: err instanceof Error ? err.message : String(err) };
  }
}

function formatSnapshotDate(ts?: string): string {
  if (!ts || ts.length < 8) return "";
  return `${ts.slice(6, 8)}/${ts.slice(4, 6)}/${ts.slice(0, 4)}`;
}

function extractJsonLd(html: string): { name?: string; description?: string; image?: string } {
  const out: { name?: string; description?: string; image?: string } = {};
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      const parsed: unknown = JSON.parse(m[1]);
      const nodes = Array.isArray(parsed) ? parsed : [parsed];
      for (const node of nodes) {
        const n = node as Record<string, unknown>;
        const type = n["@type"];
        const isProduct =
          type === "Product" ||
          (Array.isArray(type) && type.includes("Product")) ||
          (typeof type === "string" && type.toLowerCase().includes("product"));
        if (!isProduct) continue;
        if (!out.name && typeof n.name === "string") out.name = n.name;
        if (!out.description && typeof n.description === "string") out.description = n.description;
        if (!out.image) {
          if (typeof n.image === "string") out.image = n.image;
          else if (Array.isArray(n.image) && typeof n.image[0] === "string") out.image = n.image[0];
        }
      }
    } catch {
      /* JSON inválido: ignorar */
    }
  }
  return out;
}

function extractFields(html: string, store: "Amazon" | "AliExpress" | "") {
  const ld = extractJsonLd(html);

  const title = decodeHtml(
    pickMeta(html, [
      /id=["']productTitle["'][^>]*>([^<]+)</i,
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
      /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:title["']/i,
      /<title[^>]*>([^<]+)<\/title>/i,
    ]) || ld.name || "",
  );

  const description = decodeHtml(
    pickMeta(html, [
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i,
      /<meta[^>]+name=["']twitter:description["'][^>]+content=["']([^"']+)["']/i,
    ]) || ld.description || "",
  );

  const imageUrl = decodeHtml(
    pickMeta(html, [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
      /<img[^>]+id=["']landingImage["'][^>]+src=["']([^"']+)["']/i,
      /<img[^>]+src=["']([^"']+)["'][^>]+id=["']landingImage["']/i,
    ]) || ld.image || "",
  );

  const priceNote =
    store === "Amazon"
      ? "Precio en Amazon / Price on Amazon"
      : store === "AliExpress"
        ? "Precio en AliExpress / Price on AliExpress"
        : "";

  return { title, description, imageUrl, priceNote };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { url?: string };
    const rawUrl = (body.url ?? "").trim();
    if (!rawUrl) return NextResponse.json({ error: "Falta la url" }, { status: 400 });

    let url: URL;
    try {
      url = new URL(rawUrl);
    } catch {
      return NextResponse.json({ error: "Url no válida" }, { status: 400 });
    }

    const store = detectStore(url.toString());
    const affiliateUrl =
      store === "Amazon"
        ? withAmazonTag(url.toString(), process.env.AMAZON_TAG ?? "0noxtackore-20")
        : url.toString();

    const priceNote =
      store === "Amazon"
        ? "Precio en Amazon / Price on Amazon"
        : store === "AliExpress"
          ? "Precio en AliExpress / Price on AliExpress"
          : "";

    const partial = (warning: string, status = 200) =>
      NextResponse.json(
        {
          ok: false,
          error: "blocked",
          data: { name: "", description: "", imageUrl: "", store, priceNote, affiliateUrl, source: "direct" as const, warning },
        },
        { status },
      );

    // 1) Fetch directo (o ScraperAPI si hay key configurada)
    let html = "";
    let source: Extracted["source"] = "direct";
    let directError = "";
    const scraperKey = process.env.SCRAPERAPI_KEY;

    if (scraperKey) {
      const target = `https://api.scraperapi.com/?api_key=${scraperKey}&url=${encodeURIComponent(url.toString())}&country_code=us`;
      const r = await fetchText(target, 15000);
      html = r.html;
      directError = r.error ?? "";
      source = "scraperapi";
      if (looksBlocked(html, url.toString())) html = "";
    } else {
      const r = await fetchText(url.toString(), 8000);
      html = r.html;
      directError = r.error ?? "";
      if (looksBlocked(html, url.toString())) html = "";
    }

    // 2) Fallback: copia archivada en Wayback Machine
    let warning: string | undefined;
    if (!html) {
      const wb = await fetchViaWayback(url.toString());
      if (wb.html && !looksBlocked(wb.html, url.toString())) {
        html = wb.html;
        source = "wayback";
        const date = formatSnapshotDate(wb.date);
        warning = date
          ? `Extracción desde copia archivada (${date}). Revisa nombre, imagen y precio antes de guardar.`
          : "Extracción desde copia archivada. Revisa nombre, imagen y precio antes de guardar.";
      } else {
        const reason = directError || wb.error || "bloqueado por la tienda";
        return partial(
          `No se pudo extraer el contenido (${reason}). Amazon/AliExpress suelen bloquear servidores. Rellena el formulario a mano: la URL afiliada y la tienda ya están completas.`,
        );
      }
    }

    const { title, description, imageUrl, priceNote: pn } = extractFields(html, store);

    if (!title) {
      return partial(
        "No se encontró el nombre del producto en la página extraída. Rellena el formulario a mano: la URL afiliada y la tienda ya están completas.",
      );
    }

    const data: Extracted = {
      name: title.slice(0, 160),
      description: description.slice(0, 300),
      imageUrl,
      store,
      priceNote: pn || priceNote,
      affiliateUrl,
      source,
      warning,
    };

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json(
      { error: "Error en la extracción", detail: String(err) },
      { status: 500 },
    );
  }
}