#!/usr/bin/env node
/**
 * Importa tmp/products/polished.json a Firestore como borradores (active=false).
 *
 * - Lee credenciales de .env.local (gitignored): NEXT_PUBLIC_FIREBASE_API_KEY,
 *   NEXT_PUBLIC_ADMIN_EMAIL, ADMIN_PASSWORD. Nunca se imprimen.
 * - Deduplica contra los productos ya existentes en Firestore y contra
 *   tmp/products/seen.json (normalizando URLs: sin tag ni tracking params).
 * - Escribe el informe en tmp/products/imported.json y actualiza seen.json.
 *
 * Uso: node scripts/import-drafts.mjs
 * Códigos de salida: 0 = ok, 1 = error fatal (env/auth), 2 = no hay productos pulidos.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TMP = path.join(ROOT, "tmp", "products");
const POLISHED = path.join(TMP, "polished.json");
const SEEN = path.join(TMP, "seen.json");
const REPORT = path.join(TMP, "imported.json");

function loadEnvLocal() {
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.replace(/^\uFEFF/, "");
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(m[1] in process.env)) process.env[m[1]] = value;
  }
}

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function normalizeUrl(raw) {
  try {
    const u = new URL(String(raw).trim());
    u.hash = "";
    for (const p of [
      "tag",
      "ref",
      "ref_",
      "th",
      "linkCode",
      "linkId",
      "ascsubtag",
      "content-id",
      "crid",
      "sprefix",
      "dib",
      "dib_tag",
      "qid",
      "sr",
      "spm",
      "scm",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "pdp_search",
      "gateway_adaptor",
      "channel",
    ]) {
      u.searchParams.delete(p);
    }
    let s = u.toString();
    if (s.endsWith("?")) s = s.slice(0, -1);
    return s.replace(/\/$/, "").toLowerCase();
  } catch {
    return String(raw).trim().toLowerCase();
  }
}

function applyAmazonTag(url, store, tag) {
  if (store !== "Amazon") return url;
  try {
    const u = new URL(url);
    if (!u.hostname.toLowerCase().includes("amazon.")) return url;
    if (tag) u.searchParams.set("tag", tag);
    return u.toString();
  } catch {
    return url;
  }
}

function toFields(item, now, amazonTag) {
  const affiliateUrl = applyAmazonTag(item.affiliateUrl, item.store, amazonTag);
  const fields = {
    active: { booleanValue: false },
    store: { stringValue: item.store === "AliExpress" ? "AliExpress" : "Amazon" },
    category: { stringValue: String(item.category ?? "") },
    affiliateUrl: { stringValue: affiliateUrl },
    imageUrl: { stringValue: String(item.imageUrl ?? "") },
    imageSource: { stringValue: item.imageSource === "custom" ? "custom" : "affiliate" },
    priceNoteEs: { stringValue: String(item.priceNoteEs ?? "") },
    priceNoteEn: { stringValue: String(item.priceNoteEn ?? "") },
    nameEs: { stringValue: String(item.nameEs ?? "") },
    nameEn: { stringValue: String(item.nameEn ?? "") },
    descriptionEs: { stringValue: String(item.descriptionEs ?? "") },
    descriptionEn: { stringValue: String(item.descriptionEn ?? "") },
    createdAt: { stringValue: now },
    updatedAt: { stringValue: now },
  };
  if (item.badgeEs) fields.badgeEs = { stringValue: String(item.badgeEs) };
  if (item.badgeEn) fields.badgeEn = { stringValue: String(item.badgeEn) };
  return { fields, affiliateUrl };
}

async function signIn(email, password, apiKey) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.idToken) {
    const code = json?.error?.message || `HTTP ${res.status}`;
    fail(
      `Autenticación fallida (${code}). Verifica NEXT_PUBLIC_ADMIN_EMAIL y ADMIN_PASSWORD en .env.local.`,
    );
  }
  return json.idToken;
}

async function fetchExistingKeys(projectId, token) {
  const keys = new Set();
  let pageToken = "";
  for (;;) {
    const url =
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products` +
      `?pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 404) break;
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      fail(`No se pudieron leer los productos existentes (HTTP ${res.status}): ${JSON.stringify(json.error ?? json)}`);
    }
    for (const doc of json.documents ?? []) {
      const v = doc.fields?.affiliateUrl?.stringValue;
      if (v) keys.add(normalizeUrl(v));
    }
    if (!json.nextPageToken) break;
    pageToken = json.nextPageToken;
  }
  return keys;
}

async function createProduct(projectId, token, fields) {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    },
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${json.error?.message ?? JSON.stringify(json)}`);
  }
  return json.name ?? "";
}

async function main() {
  loadEnvLocal();

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const amazonTag = process.env.AMAZON_TAG || "0noxtackore-20";

  if (!apiKey || !projectId) {
    fail("Faltan NEXT_PUBLIC_FIREBASE_API_KEY / NEXT_PUBLIC_FIREBASE_PROJECT_ID en .env.local.");
  }
  if (!email) fail("Falta NEXT_PUBLIC_ADMIN_EMAIL en .env.local.");
  if (!password) {
    fail(
      "Falta ADMIN_PASSWORD en .env.local. Agrega una línea ADMIN_PASSWORD=<tu contraseña> " +
        "(solo local, no se sube a Vercel) y vuelve a ejecutar.",
    );
  }

  const polished = readJson(POLISHED, null);
  const items = Array.isArray(polished?.items) ? polished.items : [];
  if (items.length === 0) {
    console.error(
      "No hay productos pulidos en tmp/products/polished.json. " +
        "Ejecuta antes la etapa de form-filler y marketer.",
    );
    process.exit(2);
  }

  const seen = readJson(SEEN, { urls: [], keys: [] });
  const seenKeys = new Set(Array.isArray(seen.keys) ? seen.keys : []);
  const seenUrls = Array.isArray(seen.urls) ? seen.urls : [];

  const token = await signIn(email, password, apiKey);
  const existingKeys = await fetchExistingKeys(projectId, token);

  const report = { runAt: new Date().toISOString(), imported: [], skipped: [], errors: [] };
  const newSeenUrls = [...seenUrls];
  const newSeenKeys = [...seenKeys];

  for (const item of items) {
    const url = String(item?.affiliateUrl ?? "").trim();
    const name = String(item?.nameEs ?? item?.nameEn ?? "").trim();
    if (!url || !name) {
      report.skipped.push({ url: url || "(sin url)", reason: "faltan campos requeridos (name/affiliateUrl)" });
      continue;
    }
    const key = normalizeUrl(url);
    if (seenKeys.has(key) || existingKeys.has(key)) {
      report.skipped.push({ url, reason: "duplicado (ya en la tienda o visto antes)" });
      continue;
    }
    try {
      const { fields, affiliateUrl } = toFields(item, new Date().toISOString(), amazonTag);
      const docName = await createProduct(projectId, token, fields);
      report.imported.push({ nameEs: name, store: item.store, id: docName });
      newSeenUrls.push(affiliateUrl);
      newSeenKeys.push(key);
      existingKeys.add(key);
      console.log(`OK  [${item.store}] ${name}`);
    } catch (err) {
      report.errors.push({ url, message: String(err) });
      console.error(`ERR [${item.store}] ${name}: ${err}`);
    }
  }

  writeJson(SEEN, { urls: newSeenUrls, keys: newSeenKeys, updatedAt: new Date().toISOString() });
  writeJson(REPORT, report);

  const summary = {
    imported: report.imported.length,
    skipped: report.skipped.length,
    errors: report.errors.length,
    report: path.relative(ROOT, REPORT).replace(/\\/g, "/"),
  };
  console.log(`RESUMEN ${JSON.stringify(summary)}`);
  process.exit(report.errors.length > 0 ? 1 : 0);
}

main().catch((err) => fail(String(err?.stack || err)));
