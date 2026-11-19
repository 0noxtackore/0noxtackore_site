import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Fixed to the date the content was last meaningfully updated, so crawlers
// get a stable freshness signal instead of a new timestamp on every deploy.
const lastModified = new Date("2026-11-19T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://0noxtackore.makes.fyi/",
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://0noxtackore.makes.fyi/guia",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://0noxtackore.makes.fyi/acerca",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
