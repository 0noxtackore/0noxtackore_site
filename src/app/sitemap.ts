import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const lastModified = new Date("2026-11-19T00:00:00.000Z");
const base = "https://0noxtackore.makes.fyi";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/guia", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/acerca", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of ["es", "en"]) {
    for (const item of paths) {
      entries.push({
        url: `${base}/${locale}${item.path}`,
        lastModified,
        changeFrequency: item.changeFrequency,
        priority: item.priority,
        alternates: {
          languages: {
            es: `${base}/es${item.path}`,
            en: `${base}/en${item.path}`,
          },
        },
      });
    }
  }
  return entries;
}
