import fs from "node:fs";

const SEP = "\n---\n";
const MAX_LEN = 800;
const strings = JSON.parse(fs.readFileSync("tmp/en-strings.json", "utf8"));
const entries = Object.entries(strings);

const TARGETS = {
  "pt-br": "pt", "pt-pt": "pt", "fr-fr": "fr", "de-de": "de", "it-it": "it", "nl-nl": "nl",
  "sv-se": "sv", "da-dk": "da", "fi-fi": "fi", "pl-pl": "pl", "tr-tr": "tr", "ja-jp": "ja",
  "ko-kr": "ko", "zh-cn": "zh-CN",
};

async function translateBatch(text, to) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(to)}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!Array.isArray(json?.[0])) throw new Error("bad response");
  return json[0].map((p) => (Array.isArray(p) && typeof p[0] === "string" ? p[0] : "")).join("");
}

function batches(list) {
  const out = [];
  let current = [], length = 0;
  for (const entry of list) {
    const len = entry[1].length + SEP.length;
    if (current.length && length + len > MAX_LEN) { out.push(current); current = []; length = 0; }
    current.push(entry); length += len;
  }
  if (current.length) out.push(current);
  return out;
}

const out = {};
for (const [locale, target] of Object.entries(TARGETS)) {
  const result = {};
  for (const batch of batches(entries)) {
    try {
      const translated = (await translateBatch(batch.map((x) => x[1]).join(SEP), target)).split(SEP);
      if (translated.length !== batch.length) throw new Error(`count ${translated.length}/${batch.length}`);
      batch.forEach(([key], idx) => { result[key] = translated[idx].trim(); });
    } catch (err) {
      batch.forEach(([key, value]) => { result[key] = value; });
      console.error(`${locale} batch fallback: ${String(err)}`);
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  out[locale] = result;
  const dest = "src/components/sites/0noxtackore/ui-translations.json";
  fs.writeFileSync(dest, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`translated ${locale}: ${Object.keys(result).length}`);
}

