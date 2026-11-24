#!/usr/bin/env node
/**
 * Ping IndexNow so participating search engines (Bing, Yandex, etc.) are
 * notified quickly when content changes.
 *
 * Usage:
 *   node scripts/indexnow.mjs                 # URLs from live sitemap (+ fallback)
 *   node scripts/indexnow.mjs <url> [<url>]   # specific URLs
 *
 * Requires the key file at public/<KEY>.txt so engines can verify ownership.
 * Note: Google does not use IndexNow; use GSC + sitemap for Google.
 */
import https from "node:https";

const KEY = "78b8ca671862cf7827495cfa5d0eba98";
const HOST = "0noxtackore.makes.fyi";
const SITE = `https://${HOST}`;
const SITEMAP_URL = `${SITE}/sitemap.xml`;

const FALLBACK_URLS = [
  `${SITE}/es`,
  `${SITE}/es/guia`,
  `${SITE}/es/acerca`,
  `${SITE}/es/tienda`,
  `${SITE}/en`,
  `${SITE}/en/guide`,
  `${SITE}/en/about`,
  `${SITE}/en/store`,
];

const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "0noxtackore-indexnow/1.0" } }, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) resolve(data);
          else reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        });
      })
      .on("error", reject);
  });
}

async function getUrlsFromSitemap() {
  const xml = await get(SITEMAP_URL);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const urls = [...new Set(locs)].filter((u) => u.startsWith(SITE));
  if (urls.length === 0) throw new Error("No URLs found in sitemap");
  return urls;
}

function ping(endpoint, urls) {
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls,
  });

  return new Promise((resolve) => {
    const req = https.request(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve({ status: res.statusCode, body: data }));
      },
    );
    req.on("error", (e) => resolve({ status: 0, body: e.message }));
    req.write(body);
    req.end();
  });
}

async function resolveUrls() {
  if (process.argv.length > 2) return [...new Set(process.argv.slice(2))];
  try {
    const urls = await getUrlsFromSitemap();
    console.log(`Loaded ${urls.length} URLs from sitemap.`);
    return urls;
  } catch (err) {
    console.warn(`Sitemap fetch failed, using fallback URLs: ${err.message}`);
    return FALLBACK_URLS;
  }
}

const urls = await resolveUrls();
console.log(`Submitting ${urls.length} URLs to IndexNow...`);

for (const endpoint of ENDPOINTS) {
  const { status, body } = await ping(endpoint, urls);
  const ok = status === 200 || status === 202;
  console.log(`${ok ? "OK" : "WARN"}  ${status}  ${endpoint}${body ? " - " + body : ""}`);
}
