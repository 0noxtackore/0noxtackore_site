import type { MetadataRoute } from "next";

import { getContent } from "@/components/sites/0noxtackore/content";
import { INDEXED_LOCALES, siteAreaPath, sitePath, siteProductPath, type PageKey } from "@/lib/i18n";
import { getActiveProducts } from "@/lib/store/products";

export const revalidate = 3600;

const base = "https://0noxtackore.makes.fyi";

const PAGES: { key: PageKey | "home"; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { key: "home", priority: 1, changeFrequency: "weekly" },
  { key: "guia", priority: 0.8, changeFrequency: "monthly" },
  { key: "acerca", priority: 0.8, changeFrequency: "monthly" },
  { key: "tienda", priority: 0.8, changeFrequency: "weekly" },
  { key: "filosofia", priority: 0.5, changeFrequency: "monthly" },
  { key: "recomendaciones", priority: 0.6, changeFrequency: "monthly" },
  { key: "confianza", priority: 0.4, changeFrequency: "monthly" },
  { key: "proyectos", priority: 0.5, changeFrequency: "monthly" },
  { key: "contacto", priority: 0.4, changeFrequency: "yearly" },
  { key: "privacidad", priority: 0.5, changeFrequency: "yearly" },
  { key: "areas", priority: 0.6, changeFrequency: "monthly" },
];

function loc(path: string) { return `${base}${path}`; }
function languages(paths: string[]) {
  const out: Record<string, string> = {};
  INDEXED_LOCALES.forEach((locale) => { out[locale.toUpperCase()] = loc(paths[INDEXED_LOCALES.indexOf(locale)]); });
  out["x-default"] = loc(paths[0]);
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const item of PAGES) {
    const paths = INDEXED_LOCALES.map((siteLocale) => sitePath(item.key, siteLocale));
    for (let i = 0; i < INDEXED_LOCALES.length; i++) {
      entries.push({
        url: loc(paths[i]),
        lastModified,
        changeFrequency: item.changeFrequency,
        priority: item.priority,
        alternates: { languages: languages(paths) },
      });
    }
  }

  for (const area of getContent("es").areas) {
    const paths = INDEXED_LOCALES.map((siteLocale) => siteAreaPath(area.slug, siteLocale));
    for (let i = 0; i < INDEXED_LOCALES.length; i++) {
      entries.push({
        url: loc(paths[i]),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: { languages: languages(paths) },
      });
    }
  }

  try {
    const products = await getActiveProducts();
    for (const product of products) {
      const paths = INDEXED_LOCALES.map((siteLocale) => siteProductPath(product.id, siteLocale));
      const modified = product.updatedAt ? new Date(product.updatedAt) : lastModified;
      for (let i = 0; i < INDEXED_LOCALES.length; i++) {
        entries.push({
          url: loc(paths[i]),
          lastModified: modified,
          changeFrequency: "weekly",
          priority: 0.7,
          alternates: { languages: languages(paths) },
        });
      }
    }
  } catch {
    // Keep static entries if product fetch fails.
  }

  return entries;
}
