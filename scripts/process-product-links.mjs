#!/usr/bin/env node
/**
 * Lee data/product-links.txt (una URL por línea), verifica cada producto,
 * genera tmp/products/polished.json y ejecuta import-drafts + publish-drafts.
 *
 * Uso:
 *   node scripts/process-product-links.mjs           # importa + publica validados
 *   node scripts/process-product-links.mjs --dry-run # solo genera polished.json
 *
 * Reglas: no inventa datos. Si no puede verificar imagen/título/tienda, descarta.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LINKS = path.join(ROOT, "data", "product-links.txt");
const TMP = path.join(ROOT, "tmp", "products");
const POLISHED = path.join(TMP, "polished.json");
const REPORT = path.join(TMP, "links-report.json");
const DRY_RUN = process.argv.includes("--dry-run");

function log(msg) { console.log(`[links] ${msg}`); }
function writeJson(file, data) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8"); }
function isHttpUrl(v) { try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:"; } catch { return false; } }
function decodeEntities(s) { return String(s || "").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/gi, "'").replace(/&apos;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16))).replace(/\s+/g, " ").trim(); }

function detectStore(url) {
  const h = new URL(url).hostname.toLowerCase();
  if (h.includes("amazon.")) return "Amazon";
  if (h.includes("aliexpress.")) return "AliExpress";
  if (h.includes("dhgate.")) return "DHgate";
  if (h.includes("redmagic.")) return "RedMagic";
  return null;
}

function cleanUrl(raw) {
  const u = new URL(raw.trim());
  u.hash = "";
  // No borrar tracking propio/UTM/spm/etc.: los CSVs AliExpress deben conservarse tal cual.
  if (u.hostname.toLowerCase().includes("amazon.")) u.searchParams.set("tag", "0noxtackore-20");
  return u.toString();
}

function extractMeta(html, prop) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${prop}["']`, "i"),
  ];
  for (const re of patterns) { const m = html.match(re); if (m?.[1]) return decodeEntities(m[1].trim()); }
  return "";
}

function cleanTitle(s) {
  return decodeEntities(String(s || ""))
    .replace(/\s*[|\-–—:]\s*(Amazon|AliExpress|DHgate|RedMagic).*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isUselessTitle(s) {
  const t = cleanTitle(s).toLowerCase();
  if (!t || t.length < 3) return true;
  return /^(amazon|aliexpress|dhgate|redmagic|404|not found|page not found|access denied|robot check|captcha|just a moment|welcome|home|product|item|undefined|null)$/i.test(t);
}

function unescapeJsonish(s) {
  return String(s || "")
    .replace(/\\u002F/gi, "/")
    .replace(/\\\//g, "/")
    .replace(/\\u0026/gi, "&");
}

function jsonString(s) {
  try { return JSON.parse(`"${String(s || "").replace(/"/g, '\\"')}"`); }
  catch { return unescapeJsonish(String(s || "")).replace(/\\"/g, '"'); }
}

function collectLdNodes(value, out = []) {
  if (!value) return out;
  if (Array.isArray(value)) { for (const v of value) collectLdNodes(v, out); return out; }
  if (typeof value !== "object") return out;
  out.push(value);
  for (const k of ["@graph", "mainEntity", "item", "product", "offers", "image"]) collectLdNodes(value[k], out);
  return out;
}

function isProductNode(n) {
  const type = n?.["@type"];
  if (typeof type === "string") return type.toLowerCase().includes("product");
  if (Array.isArray(type)) return type.some((t) => String(t).toLowerCase().includes("product"));
  return false;
}

function extractJsonLdProducts(html) {
  const nodes = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try { collectLdNodes(JSON.parse(m[1].trim()), nodes); } catch { /* JSON-LD inválido */ }
  }
  const products = nodes.filter(isProductNode);
  return products.length ? products : nodes.filter((n) => typeof n?.name === "string" && n.name.trim());
}

function matchJsonString(html, keys) {
  for (const key of keys) {
    const re = new RegExp(`"${key}"\\s*:\\s*"((?:\\\\.|[^"\\\\])+)"`, "i");
    const m = html.match(re);
    if (m?.[1]) {
      const s = cleanTitle(jsonString(m[1]));
      if (!isUselessTitle(s)) return s;
    }
  }
  return "";
}

function extractTitle(html) {
  const ld = extractJsonLdProducts(html);
  const candidates = [
    extractMeta(html, "og:title"),
    extractMeta(html, "twitter:title"),
    ld.find((n) => typeof n.name === "string" && !isUselessTitle(n.name))?.name || "",
    extractMeta(html, "title"),
    (html.match(/id=["']productTitle["'][^>]*>([^<]+)</i) || [])[1] || "",
    (html.match(/<h1[^>]*>([\s\S]{3,300}?)<\/h1>/i) || [])[1]?.replace(/<[^>]+>/g, " ") || "",
    matchJsonString(html, ["productTitle", "productName", "subject", "seoTitle", "shortName", "title"]),
    (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] || "",
  ];
  for (const c of candidates) {
    const s = cleanTitle(c);
    if (!isUselessTitle(s)) return s;
  }
  return "";
}

function normalizeImage(v, base = "") {
  let s = decodeEntities(unescapeJsonish(String(v || ""))).trim().replace(/^['"]|['"]$/g, "");
  if (!s) return "";
  if (s.startsWith("//")) s = `https:${s}`;
  else if (!/^https?:\/\//i.test(s) && base) { try { s = new URL(s, base).toString(); } catch { return ""; } }
  return isHttpUrl(s) ? s : "";
}

function addImage(list, v, base = "") {
  const s = normalizeImage(v, base);
  if (s && !list.includes(s)) list.push(s);
}

function imageFromObject(list, value, base = "") {
  if (!value) return;
  if (typeof value === "string") { addImage(list, value, base); return; }
  if (Array.isArray(value)) { for (const v of value) imageFromObject(list, v, base); return; }
  if (typeof value === "object") {
    for (const k of ["url", "contentUrl", "src", "image", "imageUrl", "originalUrl", "largeImage", "hiRes", "large", "mainUrl"]) {
      if (value[k]) imageFromObject(list, value[k], base);
    }
  }
}

function extractImage(html, base = "") {
  const images = [];
  for (const n of extractJsonLdProducts(html)) {
    imageFromObject(images, n.image, base);
    imageFromObject(images, n.images, base);
    imageFromObject(images, n.imagePathList, base);
  }
  for (const prop of ["og:image", "twitter:image", "image"]) addImage(images, extractMeta(html, prop), base);
  const patterns = [
    /<img[^>]+id=["']landingImage["'][^>]+src=["']([^"']+)["']/gi,
    /data-src=["']([^"']+)["']/gi,
    /data-zoom-image=["']([^"']+)["']/gi,
    /data-image=["']([^"']+)["']/gi,
    /"hiRes"\s*:\s*"([^"]+)"/gi,
    /"large"\s*:\s*"([^"]+)"/gi,
    /"mainUrl"\s*:\s*"([^"]+)"/gi,
    /"imageUrl"\s*:\s*"([^"]+)"/gi,
    /"imgUrl"\s*:\s*"([^"]+)"/gi,
    /"originalUrl"\s*:\s*"([^"]+)"/gi,
    /"imagePathList"\s*:\s*\[([^\]]+)\]/gi,
    /src=["']((?:https?:)?\/\/[^"']*(?:alicdn|media-amazon|m\.media-amazon|ae01|ae04|dhgate|redmagic)[^"']+)["']/gi,
  ];
  for (const re of patterns) {
    let mm;
    while ((mm = re.exec(html))) {
      const chunk = mm[1];
      if (chunk.includes('"')) {
        for (const im of chunk.matchAll(/(?:https?:)?\/\/[^"'\s,]+/g)) addImage(images, im[0], base);
      } else addImage(images, chunk, base);
    }
  }
  return images[0] || "";
}

function extractDescription(html) {
  const ld = extractJsonLdProducts(html).find((n) => typeof n.description === "string" && n.description.trim().length >= 20);
  const text = decodeEntities(
    ld?.description ||
    extractMeta(html, "og:description") ||
    extractMeta(html, "description") ||
    extractMeta(html, "twitter:description") ||
    matchJsonString(html, ["productDesc", "description", "shortDescription"]) ||
    "",
  ).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length >= 20 ? text.slice(0, 500) : "";
}

function guessCategory(name) {
  const n = name.toLowerCase();
  if (/laptop|notebook|macbook|thinkpad/.test(n)) return "Laptops";
  if (/phone|smartphone|iphone|android|pixel \d|galaxy s\d|redmagic|oneplus|nothing phone|motorola edge|redmi note|poco x\d/.test(n)) return "Smartphones";
  if (/\b(memoria ram|ram kit|sodimm|dimm)\b/.test(n) || (/\b(ddr4|ddr5)\b/.test(n) && !/\b(laptop|notebook|desktop|tower|computer|all-in-one|aio|macbook|imac|nuc|mini pc|pc gamer|gaming pc)\b/.test(n))) return "Memorias RAM";
  if (/mouse|teclado|keyboard|monitor|ssd|gpu|cpu|motherboard|hub|dock/.test(n)) return "PC & Componentes";
  if (/gaming|gamer|gamepad|controller|headset gamer|rtx|playstation|xbox/.test(n)) return "Gaming";
  if (/headphone|earbud|speaker|audio|microphone|mic/.test(n)) return "Audio";
  if (/smart home|alexa|google home|plug|bulb|camera/.test(n)) return "Smart Home";
  return "Accesorios";
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      "accept-language": "en-US,en;q=0.9,es;q=0.8",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

async function processUrl(raw) {
  const original = raw.trim();
  if (!isHttpUrl(original)) return { ok: false, url: original, reason: "URL inválida" };
  const store = detectStore(original);
  if (!store) return { ok: false, url: original, reason: "Solo Amazon/AliExpress/DHgate/RedMagic" };
  const affiliateUrl = cleanUrl(original);
  let html;
  try { html = await fetchHtml(affiliateUrl); }
  catch (e) { return { ok: false, url: affiliateUrl, store, reason: `fetch falló: ${e.message}` }; }

  const title = extractTitle(html);
  const imageUrl = extractImage(html, original);
  if (!title) return { ok: false, url: affiliateUrl, store, reason: "sin título verificable" };
  if (!isHttpUrl(imageUrl)) return { ok: false, url: affiliateUrl, store, reason: "sin imagen verificable" };
  if (/robot check|captcha|access denied/i.test(html)) return { ok: false, url: affiliateUrl, store, reason: "bloqueado por anti-bot" };

  const category = guessCategory(title);
  const shortName = title.length > 140 ? title.slice(0, 137).trim() + "..." : title;
  const pageDescription = extractDescription(html);
  const descEs = pageDescription || `Producto tech de ${store} en categoría ${category}. Verifica detalles y precio en la página oficial.`;
  const descEn = pageDescription || `Tech product from ${store} in the ${category} category. Check details and price on the official page.`;
  return {
    ok: true,
    item: {
      active: false,
      store,
      category,
      affiliateUrl,
      imageUrl,
      imageSource: "affiliate",
      priceNoteEs: store === "Amazon" ? "Ver precio en Amazon" : store === "AliExpress" ? "Ver precio en AliExpress" : store === "DHgate" ? "Ver precio en DHgate" : "Ver precio en RedMagic",
      priceNoteEn: store === "Amazon" ? "See price on Amazon" : store === "AliExpress" ? "See price on AliExpress" : store === "DHgate" ? "See price on DHgate" : "See price on RedMagic",
      nameEs: shortName,
      nameEn: shortName,
      descriptionEs: descEs,
      descriptionEn: descEn,
      badgeEs: "",
      badgeEn: "",
    },
  };
}

function run(cmd, args) {
  log(`run: ${cmd} ${args.join(" ")}`);
  const quoted = process.platform === "win32" && cmd.includes(" ") ? `"${cmd}"` : cmd;
  const r = spawnSync(quoted, args, { cwd: ROOT, stdio: "inherit", shell: process.platform === "win32" });
  return r.status ?? 1;
}

async function main() {
  if (!fs.existsSync(LINKS)) { console.error(`No existe ${LINKS}`); process.exit(1); }
  const lines = fs.readFileSync(LINKS, "utf8").split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#"));
  if (lines.length === 0) { console.log("No hay links en data/product-links.txt"); process.exit(0); }

  fs.mkdirSync(TMP, { recursive: true });
  const report = { runAt: new Date().toISOString(), total: lines.length, accepted: [], rejected: [] };
  const items = [];

  for (const line of lines) {
    log(`procesando: ${line}`);
    const r = await processUrl(line);
    if (r.ok) { items.push(r.item); report.accepted.push({ url: r.item.affiliateUrl, name: r.item.nameEs, store: r.item.store }); log(`OK ${r.item.store} ${r.item.nameEs}`); }
    else { report.rejected.push({ url: r.url, reason: r.reason, store: r.store || null }); log(`NO ${r.url} -> ${r.reason}`); }
  }

  writeJson(POLISHED, { generatedAt: new Date().toISOString(), source: "product-links", items });
  writeJson(REPORT, report);
  log(`polished: ${items.length} items, rejected: ${report.rejected.length}`);

  if (DRY_RUN) { log("dry-run: no se importa/publica"); return; }
  if (items.length === 0) { log("sin items válidos; nada que importar"); return; }
  const importRc = run(process.execPath.includes("node") ? process.execPath : "node", ["scripts/import-drafts.mjs"]);
  if (importRc !== 0) process.exit(importRc);
  run(process.execPath, ["scripts/publish-drafts.mjs", "--dry-run"]);
  const pubRc = run(process.execPath, ["scripts/publish-drafts.mjs"]);
  process.exit(pubRc);
}

main().catch(e => { console.error(e); process.exit(1); });
