import fs from "node:fs";
import path from "node:path";

const KEYS = [
  "all",
  "contact",
  "heroExplore",
  "heroPhilosophy",
  "areasKicker",
  "areasTitle",
  "philosophyTitle",
  "readGuide",
  "faqKicker",
  "faqTitle",
  "socialTitle",
  "projectsTitle",
];

const SOURCE = {
  all: "All",
  contact: "Contact",
  heroExplore: "Explore areas",
  heroPhilosophy: "Our philosophy",
  areasKicker: "What we do",
  areasTitle: "Areas of activity",
  philosophyTitle: "Our philosophy",
  readGuide: "Read the full guide",
  faqKicker: "Frequently asked questions",
  faqTitle: "Answers to your questions",
  socialTitle: "Follow us",
  projectsTitle: "Projects and solutions",
};

const TARGETS = {
  "pt-br": "pt",
  "pt-pt": "pt",
  "fr-fr": "fr",
  "de-de": "de",
  "it-it": "it",
  "nl-nl": "nl",
  "sv-se": "sv",
  "da-dk": "da",
  "fi-fi": "fi",
  "pl-pl": "pl",
  "tr-tr": "tr",
  "ja-jp": "ja",
  "ko-kr": "ko",
  "zh-cn": "zh-CN",
};

async function translate(text, to) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(to)}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const parts = Array.isArray(json?.[0]) ? json[0].map((p) => (Array.isArray(p) && typeof p[0] === "string" ? p[0] : "")).join("") : "";
  return parts.trim();
}

const out = {};
for (const [locale, target] of Object.entries(TARGETS)) {
  out[locale] = {};
  for (const key of KEYS) {
    try {
      out[locale][key] = await translate(SOURCE[key], target);
    } catch (err) {
      out[locale][key] = SOURCE[key];
      console.error(`${locale}.${key}: ${String(err)}`);
    }
    await new Promise((r) => setTimeout(r, 120));
  }
  console.log(`translated ${locale}`);
}

const dest = path.join(process.cwd(), "src", "components", "sites", "0noxtackore", "ui-translations.json");
fs.writeFileSync(dest, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log(`wrote ${dest}`);
