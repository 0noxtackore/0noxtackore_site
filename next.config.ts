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
    return [
      ...sections.map((section) => ({
        source: `/${section}`,
        destination: "/",
      })),
      {
        source: "/areas/:slug",
        destination: "/",
      },
    ];
  },
};

export default nextConfig;
