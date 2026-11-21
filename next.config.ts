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
      // Locale-correct slugs (EN uses /guide and /about)
      { source: "/en/guia", destination: "/en/guide", permanent: true },
      { source: "/en/acerca", destination: "/en/about", permanent: true },
      { source: "/es/guide", destination: "/es/guia", permanent: true },
      { source: "/es/about", destination: "/es/acerca", permanent: true },
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
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com",
      "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://www.google-analytics.com https://region1.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
      "img-src 'self' data: blob: https:",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
