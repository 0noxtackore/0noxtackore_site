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

const sectionLocaleSlugs: Record<string, { es: string; en: string }> = {
  filosofia: { es: "filosofia", en: "philosophy" },
  recomendaciones: { es: "recomendaciones", en: "recommendations" },
  proyectos: { es: "proyectos", en: "projects" },
  contacto: { es: "contacto", en: "contact" },
  confianza: { es: "confianza", en: "trust" },
};

const areaLocaleSlugs: Record<string, { es: string; en: string }> = {
  "desarrollo-de-software": { es: "desarrollo-de-software", en: "software-development" },
  "ingenieria-open-source": { es: "ingenieria-open-source", en: "open-source-engineering" },
  "tecnologias-e-integraciones": { es: "tecnologias-e-integraciones", en: "technologies-and-integrations" },
  "productos-tecnologicos": { es: "productos-tecnologicos", en: "technology-products" },
  "recomendacion-y-afiliacion": { es: "recomendacion-y-afiliacion", en: "recommendation-and-affiliation" },
  "consultoria-tecnica": { es: "consultoria-tecnica", en: "technical-consulting" },
};

const defaultLocale = "es";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.alicdn.com", pathname: "/**" },
      { protocol: "https", hostname: "**.aliexpress-media.com", pathname: "/**" },
      { protocol: "https", hostname: "**.aliexpress.com", pathname: "/**" },
      { protocol: "https", hostname: "**.media-amazon.com", pathname: "/**" },
      { protocol: "https", hostname: "**.ssl-images-amazon.com", pathname: "/**" },
      { protocol: "https", hostname: "**.amazon.com", pathname: "/**" },
      { protocol: "https", hostname: "**.dhgate.com", pathname: "/**" },
      { protocol: "https", hostname: "**.redmagic.com", pathname: "/**" },
      { protocol: "https", hostname: "**.supabase.co", pathname: "/**" },
    ],
  },
  async redirects() {
    const redirects: { source: string; destination: string; permanent: boolean }[] = [];

    // Keep pre-i18n URLs working: /guia, /acerca, /areas/... → /es/...
    for (const section of sections) {
      redirects.push({ source: `/${section}`, destination: `/${defaultLocale}/${section}`, permanent: true });
    }
    redirects.push(
      { source: "/areas/:slug", destination: `/${defaultLocale}/areas/:slug`, permanent: true },
      { source: "/guia", destination: `/${defaultLocale}/guia`, permanent: true },
      { source: "/acerca", destination: `/${defaultLocale}/acerca`, permanent: true },
      { source: "/tienda", destination: `/${defaultLocale}/tienda`, permanent: true },
      // Locale-correct page slugs
      { source: "/en/guia", destination: "/en/guide", permanent: true },
      { source: "/en/acerca", destination: "/en/about", permanent: true },
      { source: "/en/tienda", destination: "/en/store", permanent: true },
      { source: "/es/guide", destination: "/es/guia", permanent: true },
      { source: "/es/about", destination: "/es/acerca", permanent: true },
      { source: "/es/store", destination: "/es/tienda", permanent: true },
    );

    // Locale-correct section slugs
    for (const pair of Object.values(sectionLocaleSlugs)) {
      redirects.push(
        { source: `/en/${pair.es}`, destination: `/en/${pair.en}`, permanent: true },
        { source: `/es/${pair.en}`, destination: `/es/${pair.es}`, permanent: true },
      );
    }

    // Locale-correct area slugs
    for (const pair of Object.values(areaLocaleSlugs)) {
      redirects.push(
        { source: `/en/areas/${pair.es}`, destination: `/en/areas/${pair.en}`, permanent: true },
        { source: `/es/areas/${pair.en}`, destination: `/es/areas/${pair.es}`, permanent: true },
      );
    }

    return redirects;
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com https://*.supabase.co",
      "img-src 'self' data: blob: https://*.alicdn.com https://*.aliexpress-media.com https://*.media-amazon.com https://*.ssl-images-amazon.com https://*.dhgate.com https://*.redmagic.com https://*.supabase.co",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; ");

    return [
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/sites/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
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
