import type { MetadataRoute } from "next";

import { getPageSlug } from "@/lib/i18n";

export const dynamic = "force-static";

const lastModified = new Date("2026-11-20T00:00:00.000Z");
const base = "https://0noxtackore.makes.fyi";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    { key: "home" as const, priority: 1, changeFrequency: "weekly" as const },
    { key: "guia" as const, priority: 0.8, changeFrequency: "monthly" as const },
    { key: "acerca" as const, priority: 0.8, changeFrequency: "monthly" as const },
  ];

  const pathFor = (locale: "es" | "en", key: "home" | "guia" | "acerca") =>
    key === "home" ? `/${locale}` : `/${locale}/${getPageSlug(locale, key)}`;

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of ["es", "en"] as const) {
    for (const item of paths) {
      entries.push({
        url: `${base}${pathFor(locale, item.key)}`,
        lastModified,
        changeFrequency: item.changeFrequency,
        priority: item.priority,
        alternates: {
          languages: {
            es: `${base}${pathFor("es", item.key)}`,
            en: `${base}${pathFor("en", item.key)}`,
          },
        },
      });
    }
  }
  return entries;
}
