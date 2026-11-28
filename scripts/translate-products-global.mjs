import fs from "node:fs";

function loadEnvLocal() {
  const file = ".env.local";
  if (!fs.existsSync(file)) return;
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.replace(/^\uFEFF/, "");
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m || m[1] in process.env) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[m[1]] = value;
  }
}
loadEnvLocal();

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const FIREBASE_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const EMAIL = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

if (!API_KEY || !FIREBASE_KEY || !PROJECT_ID || !EMAIL || !PASSWORD) {
  console.error("Faltan GOOGLE_TRANSLATE_API_KEY o credenciales Firebase en .env.local.");
  process.exit(1);
}

const source = fs.readFileSync("src/lib/site-locales.ts", "utf8");
const match = source.match(/ALL_SITE_LOCALES = \[([\s\S]*?)\] as const/);
const locales = (match ? [...match[1].matchAll(/"([a-z-]+)"/g)].map((m) => m[1]) : []).filter(
  (loc) => loc !== "es-ve" && loc !== "en-us" && !loc.startsWith("es"),
);

function googleTarget(locale) {
  const [language, region] = locale.split("-");
  return region ? `${language}-${region.toUpperCase()}` : language;
}

async function signIn() {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD, returnSecureToken: true }),
  });
  const json = await res.json();
  if (!res.ok || !json.idToken) throw new Error(json?.error?.message || "auth failed");
  return json.idToken;
}

async function fetchProducts() {
  const res = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery?key=${FIREBASE_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId: "products" }], where: { fieldFilter: { field: { fieldPath: "active" }, op: "EQUAL", value: { booleanValue: true } } } } }),
  });
  const rows = await res.json();
  if (!res.ok) throw new Error(`runQuery HTTP ${res.status}`);
  return rows.map((r) => r.document).filter(Boolean);
}

function fieldString(fields, key) { const v = fields?.[key]; return v && "stringValue" in v ? v.stringValue : ""; }
function existingTranslations(fields) {
  const v = fields?.translations;
  if (!v || !("mapValue" in v)) return {};
  const out = {};
  for (const [locale, value] of Object.entries(v.mapValue.fields ?? {})) {
    if (!("mapValue" in value)) continue;
    const f = value.mapValue.fields ?? {};
    out[locale] = { name: fieldString(f, "name"), description: fieldString(f, "description") };
  }
  return out;
}

async function translateBatch(texts, target) {
  const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(API_KEY)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: texts, source: "es", target, format: "text" }),
    signal: AbortSignal.timeout(30000),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || `HTTP ${res.status}`);
  return (json.data?.translations ?? []).map((t) => t.translatedText ?? "");
}

function chunks(list, size = 50) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

const token = await signIn();
const docs = await fetchProducts();
console.log(`products=${docs.length} locales=${locales.length}`);

for (const locale of locales) {
  const target = googleTarget(locale);
  const pairs = docs.map((doc) => ({
    doc,
    name: fieldString(doc.fields, "nameEs"),
    description: fieldString(doc.fields, "descriptionEs"),
  }));
  const texts = pairs.flatMap((p) => [p.name, p.description]);
  const translated = [];
  for (const batch of chunks(texts)) {
    try { translated.push(...await translateBatch(batch, target)); }
    catch (err) { translated.push(...batch); console.error(`${locale}: ${String(err)}`); }
  }

  for (let i = 0; i < pairs.length; i++) {
    const { doc } = pairs[i];
    const translations = existingTranslations(doc.fields);
    translations[locale] = {
      name: translated[i * 2] ?? pairs[i].name,
      description: translated[i * 2 + 1] ?? pairs[i].description,
    };
    const fields = {
      translations: {
        mapValue: {
          fields: Object.fromEntries(Object.entries(translations).map(([loc, value]) => [loc, {
            mapValue: { fields: {
              name: { stringValue: value.name || "" },
              description: { stringValue: value.description || "" },
            } },
          }])),
        },
      },
    };
    const res = await fetch(`https://firestore.googleapis.com/v1/${doc.name}?updateMask.fieldPaths=translations`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) console.error(`${locale} ${doc.name}: HTTP ${res.status}`);
  }
  console.log(`translated products -> ${locale} (${target})`);
}
