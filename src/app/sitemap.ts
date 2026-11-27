import type { MetadataRoute } from "next";

import { getContent } from "@/components/sites/0noxtackore/content";
import { getAreaSlug, getPagePath, getPageSlug } from "@/lib/i18n";
import { getActiveProducts } from "@/lib/store/products";

export const revalidate = 3600;

const base = "https://0noxtackore.makes.fyi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const paths = [
    { key: "home" as const, priority: 1, changeFrequency: "weekly" as const },
    { key: "guia" as const, priority: 0.8, changeFrequency: "monthly" as const },
    { key: "acerca" as const, priority: 0.8, changeFrequency: "monthly" as const },
    { key: "privacidad" as const, priority: 0.5, changeFrequency: "yearly" as const },
    { key: "tienda" as const, priority: 0.8, changeFrequency: "weekly" as const },
    { key: "filosofia" as const, priority: 0.5, changeFrequency: "monthly" as const },
    { key: "recomendaciones" as const, priority: 0.6, changeFrequency: "monthly" as const },
    { key: "confianza" as const, priority: 0.4, changeFrequency: "monthly" as const },
    { key: "proyectos" as const, priority: 0.5, changeFrequency: "monthly" as const },
    { key: "contacto" as const, priority: 0.4, changeFrequency: "yearly" as const },
    { key: "areas" as const, priority: 0.6, changeFrequency: "monthly" as const },
  ];

  const pathFor = (locale: "es" | "en", key: "home" | "guia" | "acerca" | "tienda" | "privacidad" | "filosofia" | "recomendaciones" | "confianza" | "proyectos" | "contacto" | "areas") =>
    key === "home" ? `/${locale}` : `/${locale}/${getPageSlug(locale, key)}`;

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of ["es", "en"] as const) {
    for (const item of paths) {
      const es = `${base}${pathFor("es", item.key)}`;
      const en = `${base}${pathFor("en", item.key)}`;
      entries.push({
        url: `${base}${pathFor(locale, item.key)}`,
        lastModified,
        changeFrequency: item.changeFrequency,
        priority: item.priority,
        alternates: {
          languages: {
            es,
            en,
            "x-default": es,
          },
        },
      });
    }
  }

  const areaKeys = getContent("es").areas.map((area) => area.slug);
  for (const key of areaKeys) {
    const es = `${base}/es/areas/${getAreaSlug("es", key)}`;
    const en = `${base}/en/areas/${getAreaSlug("en", key)}`;
    for (const locale of ["es", "en"] as const) {
      entries.push({
        url: locale === "es" ? es : en,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: { languages: { es, en, "x-default": es } },
      });
    }
  }

  try {
    const products = await getActiveProducts();
    for (const product of products) {
      const es = `${base}${getPagePath("es", "tienda")}/${product.id}`;
      const en = `${base}${getPagePath("en", "tienda")}/${product.id}`;
      const modified = product.updatedAt ? new Date(product.updatedAt) : lastModified;
      for (const locale of ["es", "en"] as const) {
        entries.push({
          url: locale === "es" ? es : en,
          lastModified: modified,
          changeFrequency: "weekly",
          priority: 0.7,
          alternates: {
            languages: {
              es,
              en,
              "x-default": es,
            },
          },
        });
      }
    }
  } catch {
    // Keep static entries if product fetch fails.
  }

  return entries;
}
