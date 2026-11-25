#!/usr/bin/env node
/**
 * Valida borradores (active=false) en Firestore y publica los que pasan.
 * - Lee credenciales de .env.local (NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_ADMIN_EMAIL, ADMIN_PASSWORD, NEXT_PUBLIC_FIREBASE_PROJECT_ID)
 * - No imprime secretos.
 * - Solo pone active=true + updatedAt en documentos que pasan validación.
 *
 * Uso: node scripts/publish-drafts.mjs [--dry-run]
 * Salida: tmp/products/publish-report.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TMP = path.join(ROOT, "tmp", "products");
const REPORT = path.join(TMP, "publish-report.json");
const DRY_RUN = process.argv.includes("--dry-run");

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

function fail(msg) { console.error(`ERROR: ${msg}`); process.exit(1); }
function writeJson(file, data) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8"); }

async function signIn(email, password, apiKey) {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.idToken) fail(`Autenticación fallida (${json?.error?.message || res.status}).`);
  return json.idToken;
}

function fStr(fields, k) { return fields?.[k]?.stringValue ?? ""; }
function fBool(fields, k) { return fields?.[k]?.booleanValue === true; }

async function fetchAllProducts(projectId, token) {
  const docs = [];
  let pageToken = "";
  for (;;) {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products?pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 404) break;
    const json = await res.json().catch(() => ({}));
    if (!res.ok) fail(`No se pudieron leer productos (HTTP ${res.status}): ${JSON.stringify(json.error ?? json)}`);
    for (const doc of json.documents ?? []) docs.push(doc);
    if (!json.nextPageToken) break;
    pageToken = json.nextPageToken;
  }
  return docs;
}

function isHttpUrl(v) {
  try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:"; } catch { return false; }
}

function validate(doc) {
  const fields = doc.fields || {};
  const reasons = [];
  const nameEs = fStr(fields, "nameEs").trim();
  const nameEn = fStr(fields, "nameEn").trim();
  const descEs = fStr(fields, "descriptionEs").trim();
  const descEn = fStr(fields, "descriptionEn").trim();
  const affiliateUrl = fStr(fields, "affiliateUrl").trim();
  const imageUrl = fStr(fields, "imageUrl").trim();
  const store = fStr(fields, "store").trim();
  const category = fStr(fields, "category").trim();

  if (!nameEs) reasons.push("falta nameEs");
  if (!nameEn) reasons.push("falta nameEn");
  if (!descEs) reasons.push("falta descriptionEs");
  if (!descEn) reasons.push("falta descriptionEn");
  if (!isHttpUrl(affiliateUrl)) reasons.push("affiliateUrl inválida");
  if (!isHttpUrl(imageUrl)) reasons.push("imageUrl inválida");
  if (!["Amazon","AliExpress","DHgate","RedMagic"].includes(store)) reasons.push("store inv?lida");
  if (!category) reasons.push("falta category");
  if (nameEs.length > 180 || nameEn.length > 180) reasons.push("nombre demasiado largo");
  if (descEs.length < 20 || descEn.length < 20) reasons.push("descripción demasiado corta");

  return { ok: reasons.length === 0, reasons, summary: { nameEs, nameEn, store, category, affiliateUrl } };
}

async function publishDoc(docName, token) {
  const now = new Date().toISOString();
  const url = `https://firestore.googleapis.com/v1/${docName}?updateMask.fieldPaths=active&updateMask.fieldPaths=updatedAt`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { active: { booleanValue: true }, updatedAt: { stringValue: now } } }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${json.error?.message ?? JSON.stringify(json)}`);
  return json.name;
}

async function main() {
  loadEnvLocal();
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!apiKey || !projectId) fail("Faltan NEXT_PUBLIC_FIREBASE_API_KEY / NEXT_PUBLIC_FIREBASE_PROJECT_ID.");
  if (!email || !password) fail("Faltan NEXT_PUBLIC_ADMIN_EMAIL / ADMIN_PASSWORD en .env.local.");

  const token = await signIn(email, password, apiKey);
  const docs = await fetchAllProducts(projectId, token);
  const drafts = docs.filter((d) => !fBool(d.fields, "active"));

  const report = { runAt: new Date().toISOString(), dryRun: DRY_RUN, totalDrafts: drafts.length, published: [], rejected: [], errors: [] };

  for (const doc of drafts) {
    const v = validate(doc);
    const id = doc.name.split("/").pop();
    if (!v.ok) {
      report.rejected.push({ id, ...v.summary, reasons: v.reasons });
      console.log(`NO  [${v.summary.store}] ${v.summary.nameEs || id} -> ${v.reasons.join("; ")}`);
      continue;
    }
    if (DRY_RUN) {
      report.published.push({ id, ...v.summary, dryRun: true });
      console.log(`DRY [${v.summary.store}] ${v.summary.nameEs}`);
      continue;
    }
    try {
      await publishDoc(doc.name, token);
      report.published.push({ id, ...v.summary });
      console.log(`OK  [${v.summary.store}] ${v.summary.nameEs}`);
    } catch (e) {
      report.errors.push({ id, ...v.summary, message: String(e) });
      console.error(`ERR [${v.summary.store}] ${v.summary.nameEs}: ${e}`);
    }
  }

  writeJson(REPORT, report);
  console.log(`RESUMEN ${JSON.stringify({ drafts: report.totalDrafts, published: report.published.length, rejected: report.rejected.length, errors: report.errors.length, dryRun: DRY_RUN, report: path.relative(ROOT, REPORT).replace(/\\/g, "/") })}`);
  process.exit(report.errors.length > 0 ? 1 : 0);
}

main().catch((e) => fail(String(e?.stack || e)));
