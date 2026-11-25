#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry-run");

function loadEnvLocal() {
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.replace(/^\uFEFF/, "");
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!(m[1] in process.env)) process.env[m[1]] = value;
  }
}
function fail(msg) { console.error("ERROR:", msg); process.exit(1); }
function fStr(fields, k) { return fields?.[k]?.stringValue ?? ""; }
function withTag(url, store, amazonTag, aliTrackId) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (store === "Amazon" && host.includes("amazon.")) { if (amazonTag) u.searchParams.set("tag", amazonTag); return u.toString(); }
    if (store === "AliExpress" && host.includes("aliexpress.")) { if (aliTrackId) u.searchParams.set("aff_trace_key", aliTrackId); return u.toString(); }
    if (store === "DHgate" && host.includes("dhgate.")) { return u.toString(); }
    if (store === "RedMagic" && host.includes("redmagic.")) { return u.toString(); }
    return url;
  } catch { return url; }
}
async function signIn(email, password, apiKey) {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.idToken) fail(`Auth failed: ${json?.error?.message || res.status}`);
  return json.idToken;
}
async function fetchAll(projectId, token) {
  const docs = []; let pageToken = "";
  for (;;) {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products?pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) fail(`Read failed ${res.status}`);
    for (const d of json.documents ?? []) docs.push(d);
    if (!json.nextPageToken) break;
    pageToken = json.nextPageToken;
  }
  return docs;
}
async function patchUrl(docName, token, affiliateUrl) {
  const now = new Date().toISOString();
  const url = `https://firestore.googleapis.com/v1/${docName}?updateMask.fieldPaths=affiliateUrl&updateMask.fieldPaths=updatedAt`;
  const res = await fetch(url, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { affiliateUrl: { stringValue: affiliateUrl }, updatedAt: { stringValue: now } } }) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
async function main() {
  loadEnvLocal();
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const amazonTag = process.env.AMAZON_TAG || "0noxtackore-20";
  const aliTrackId = process.env.ALIEXPRESS_TRACK_ID || "0noxtackore";
  if (!apiKey || !projectId || !email || !password) fail("Missing env");
  const token = await signIn(email, password, apiKey);
  const docs = await fetchAll(projectId, token);
  let updated = 0;
  for (const doc of docs) {
    const store = fStr(doc.fields, "store");
    const current = fStr(doc.fields, "affiliateUrl");
    const next = withTag(current, store, amazonTag, aliTrackId);
    if (next !== current) {
      console.log(`${DRY ? "DRY" : "OK "} [${store}] ${fStr(doc.fields, "nameEs")} -> ${next}`);
      if (!DRY) await patchUrl(doc.name, token, next);
      updated++;
    }
  }
  console.log(`RESUMEN ${JSON.stringify({ updated, dryRun: DRY })}`);
}
main().catch((e) => fail(String(e)));
