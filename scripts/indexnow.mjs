#!/usr/bin/env node
/**
 * Ping IndexNow (Bing + Yandex) so crawlers are notified immediately when
 * content changes, instead of waiting for their normal crawl cycle.
 *
 * Usage:
 *   node scripts/indexnow.mjs                 # default site URLs
 *   node scripts/indexnow.mjs <url> [<url>]   # specific URLs
 *
 * Requires the key file at public/<KEY>.txt (already committed) so the
 * search engines can verify ownership of the host.
 */
import https from "node:https";

const KEY = "78b8ca671862cf7827495cfa5d0eba98";
const HOST = "0noxtackore.makes.fyi";
const SITE = `https://${HOST}`;

const DEFAULT_URLS = [
  `${SITE}/es`,
  `${SITE}/es/guia`,
  `${SITE}/es/acerca`,
  `${SITE}/en`,
  `${SITE}/en/guia`,
  `${SITE}/en/acerca`,
];

const ENDPOINTS = [
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

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

const urls = process.argv.length > 2 ? process.argv.slice(2) : DEFAULT_URLS;
console.log("Submitting to IndexNow:", urls.join(", "));

for (const endpoint of ENDPOINTS) {
  const { status, body } = await ping(endpoint, urls);
  const ok = status === 200 || status === 202;
  console.log(`${ok ? "OK" : "WARN"}  ${status}  ${endpoint}${body ? " - " + body : ""}`);
}
