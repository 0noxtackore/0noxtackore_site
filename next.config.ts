import type { NextConfig } from "next";

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
    const add = (source: string, destination: string) => redirects.push({ source, destination, permanent: true });

    // Old root entries
    add("/guia", "/guide/es-ve");
    add("/acerca", "/about/es-ve");
    add("/tienda", "/store/es-ve");
    add("/filosofia", "/philosophy/es-ve");
    add("/recomendaciones", "/recommendations/es-ve");
    add("/confianza", "/trust/es-ve");
    add("/proyectos", "/projects/es-ve");
    add("/contacto", "/contact/es-ve");
    add("/privacidad", "/privacy/es-ve");
    add("/areas", "/areas/es-ve");

    // Old locale homes
    add("/es", "/home/es-ve");
    add("/en", "/home/en-us");

    const pageMap: Record<string, string> = {
      guia: "guide", guide: "guide",
      acerca: "about", about: "about",
      tienda: "store", store: "store",
      filosofia: "philosophy", philosophy: "philosophy",
      recomendaciones: "recommendations", recommendations: "recommendations",
      confianza: "trust", trust: "trust",
      proyectos: "projects", projects: "projects",
      contacto: "contact", contact: "contact",
      privacidad: "privacy", privacy: "privacy",
      areas: "areas",
    };
    const localeMap: Record<string, string> = { es: "es-ve", en: "en-us" };

    for (const [oldSlug, page] of Object.entries(pageMap)) {
      for (const [oldLocale, siteLocale] of Object.entries(localeMap)) {
        add(`/${oldLocale}/${oldSlug}`, `/${page}/${siteLocale}`);
      }
    }

    // Product and area details
    for (const [oldLocale, siteLocale] of Object.entries(localeMap)) {
      add(`/${oldLocale}/tienda/:id`, `/store/${siteLocale}/:id`);
      add(`/${oldLocale}/store/:id`, `/store/${siteLocale}/:id`);
      add(`/${oldLocale}/areas/:slug`, `/areas/${siteLocale}/:slug`);
    }
    add("/areas/:slug", "/areas/es-ve/:slug");

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
