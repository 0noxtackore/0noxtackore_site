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
  for (const p of ["tag","ref","ref_","th","psc","linkCode","linkId","ascsubtag","content-id","crid","sprefix","dib","dib_tag","qid","sr","keywords","utm_source","utm_medium","utm_campaign","utm_content","utm_term","spm","scm","pvid","algo_pvid"]) u.searchParams.delete(p);
  let s = u.toString();
  if (s.endsWith("?")) s = s.slice(0, -1);
  return s;
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

function extractTitle(html) {
  const og = extractMeta(html, "og:title") || extractMeta(html, "twitter:title");
  if (og) return og.replace(/\s*[|\-–—]\s*Amazon.*$/i, "").replace(/\s*[|\-–—]\s*AliExpress.*$/i, "").trim();
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return decodeEntities(m?.[1]?.replace(/\s*[|\-–—]\s*Amazon.*$/i, "").replace(/\s*[|\-–—]\s*AliExpress.*$/i, "").trim() || "");
}

function extractImage(html) {
  const og = extractMeta(html, "og:image") || extractMeta(html, "twitter:image");
  if (isHttpUrl(og)) return og;
  const m = html.match(/"hiRes":"(https:[^"]+)"/i) || html.match(/"large":"(https:[^"]+)"/i);
  return m?.[1] ? m[1].replace(/\\u002F/g, "/") : "";
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
  const imageUrl = extractImage(html);
  if (!title) return { ok: false, url: affiliateUrl, store, reason: "sin título verificable" };
  if (!isHttpUrl(imageUrl)) return { ok: false, url: affiliateUrl, store, reason: "sin imagen verificable" };
  if (/robot check|captcha|access denied/i.test(html)) return { ok: false, url: affiliateUrl, store, reason: "bloqueado por anti-bot" };

  const category = guessCategory(title);
  const shortName = title.length > 140 ? title.slice(0, 137).trim() + "..." : title;
  const descEs = `Producto tech de ${store} en categoría ${category}. Verifica detalles y precio en la página oficial.`;
  const descEn = `Tech product from ${store} in the ${category} category. Check details and price on the official page.`;
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
