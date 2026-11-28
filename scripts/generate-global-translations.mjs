import fs from "node:fs";

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
if (!API_KEY) {
  console.error("Falta GOOGLE_TRANSLATE_API_KEY en el entorno. No se envía la clave al repo ni al chat.");
  process.exit(1);
}

const strings = JSON.parse(fs.readFileSync("tmp/en-strings.json", "utf8"));
const entries = Object.entries(strings);
const dest = "src/components/sites/0noxtackore/ui-translations.json";
let out = {};
if (fs.existsSync(dest)) out = JSON.parse(fs.readFileSync(dest, "utf8"));

const source = fs.readFileSync("src/lib/site-locales.ts", "utf8");
const match = source.match(/ALL_SITE_LOCALES = \[([\s\S]*?)\] as const/);
const locales = match ? [...match[1].matchAll(/"([a-z-]+)"/g)].map((m) => m[1]) : ["es-ve", "en-us"];

function googleTarget(locale) {
  const [language, region] = locale.split("-");
  const normalized = { nb: "no", nn: "no", fil: "fil", zh: "zh" }[language] ?? language;
  return region ? `${normalized}-${region.toUpperCase()}` : normalized;
}

function chunks(list, size = 50) {
  const result = [];
  for (let i = 0; i < list.length; i += size) result.push(list.slice(i, i + size));
  return result;
}

async function translateBatch(texts, target) {
  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: texts, source: "en", target, format: "text" }),
      signal: AbortSignal.timeout(30000),
    },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${json?.error?.message ?? ""}`);
  const translations = json?.data?.translations;
  if (!Array.isArray(translations)) throw new Error("respuesta inválida");
  return translations.map((item) => item.translatedText ?? "");
}

for (const locale of locales) {
  if (locale.startsWith("es") || locale === "en-us") continue;
  const target = googleTarget(locale);
  const result = {};
  for (const batch of chunks(entries)) {
    try {
      const translated = await translateBatch(batch.map(([, value]) => value), target);
      batch.forEach(([key], i) => { result[key] = translated[i] ?? batch[i][1]; });
    } catch (err) {
      batch.forEach(([key, value]) => { result[key] = value; });
      console.error(`${locale}: ${String(err)}`);
    }
  }
  out[locale] = result;
  fs.writeFileSync(dest, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`translated ${locale} (${Object.keys(result).length}) -> ${target}`);
}

console.log(`wrote ${dest}`);
