import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const sections = [
      "areas",
      "filosofia",
      "recomendaciones",
      "contacto",
      "confianza",
      "faq",
      "compartir",
      "social",
    ];
    const rewrites = [];
    for (const locale of ["es", "en"]) {
      for (const section of sections) {
        rewrites.push({ source: `/${locale}/${section}`, destination: `/${locale}` });
      }
      rewrites.push({
        source: `/${locale}/areas/:slug`,
        destination: `/${locale}`,
      });
    }
    return rewrites;
  },
};

export default nextConfig;
