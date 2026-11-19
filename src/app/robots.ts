import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://0noxtackore.makes.fyi/sitemap.xml",
    host: "https://0noxtackore.makes.fyi",
  };
}
