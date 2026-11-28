import fs from "node:fs";

const src = fs.readFileSync("src/components/sites/0noxtackore/content.ts", "utf8");
const marker = "const en: Content = {";
const start = src.indexOf(marker);
if (start < 0) throw new Error("EN object not found");
let i = start + marker.length - 1;
let depth = 0;
let quote = null;
let escape = false;
for (; i < src.length; i++) {
  const ch = src[i];
  if (quote) {
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === quote) quote = null;
    continue;
  }
  if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue; }
  if (ch === "{") depth++;
  if (ch === "}") { depth--; if (depth === 0) { i++; break; } }
}
function extractObject(src, marker) {
  const start = src.indexOf(marker);
  if (start < 0) throw new Error(`Not found: ${marker}`);
  let i = start + marker.length - 1;
  let depth = 0, quote = null, escape = false;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (escape) { escape = false; continue; }
      if (ch === "\\") { escape = true; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue; }
    if (ch === "{") depth++;
    if (ch === "}") { depth--; if (depth === 0) { i++; break; } }
  }
  return src.slice(start + marker.length - 1, i);
}
const uiLiteral = extractObject(src, "const uiEn: Record<string, string> = {")
  .replace(/\bsiteUrl\b/g, '"https://0noxtackore.makes.fyi"');
const uiEn = new Function(`return ${uiLiteral};`)();
const literal = src.slice(start + marker.length - 1, i)
  .replace(/localizedHref\(\s*"en"\s*,\s*"([^"]+)"\s*\)/g, '"$1"')
  .replace(/\bsiteUrl\b/g, '"https://0noxtackore.makes.fyi"')
  .replace(/\buiEn\b/g, JSON.stringify(uiEn));
const obj = new Function(`return ${literal};`)();

function flatten(value, path = "", out = {}) {
  if (typeof value === "string") {
    if (value.trim() && !/^(https?:|data:|#|\/)/.test(value)) out[path] = value;
    return out;
  }
  if (Array.isArray(value)) { value.forEach((v, idx) => flatten(v, path ? `${path}.${idx}` : String(idx), out)); return out; }
  if (value && typeof value === "object") { for (const [k, v] of Object.entries(value)) flatten(v, path ? `${path}.${k}` : k, out); }
  return out;
}
const flat = flatten(obj);
console.log("strings", Object.keys(flat).length);
fs.writeFileSync("tmp/en-strings.json", JSON.stringify(flat, null, 2) + "\n", "utf8");
