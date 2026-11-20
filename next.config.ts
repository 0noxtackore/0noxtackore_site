import type { NextConfig } from "next";

const sections = [
  "areas",
  "filosofia",
  "recomendaciones",
  "proyectos",
  "contacto",
  "confianza",
  "faq",
  "compartir",
  "social",
];

const defaultLocale = "es";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    // Keep pre-i18n URLs working: /guia, /acerca, /areas/... → /es/...
    const redirects = sections.map((section) => ({
      source: `/${section}`,
      destination: `/${defaultLocale}/${section}`,
      permanent: true,
    }));
    redirects.push(
      { source: "/areas/:slug", destination: `/${defaultLocale}/areas/:slug`, permanent: true },
      { source: "/guia", destination: `/${defaultLocale}/guia`, permanent: true },
      { source: "/acerca", destination: `/${defaultLocale}/acerca`, permanent: true },
    );
    return redirects;
  },
  async rewrites() {
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
