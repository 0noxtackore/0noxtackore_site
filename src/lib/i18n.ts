import { ALL_SITE_LOCALES, INDEXED_SITE_LOCALES } from "./site-locales";

export type Locale = "es" | "en";

export const locales: Locale[] = ["es", "en"];
export const defaultLocale: Locale = "es";

export const SITE_LOCALES = ALL_SITE_LOCALES;
export const INDEXED_LOCALES = INDEXED_SITE_LOCALES;
export type SiteLocale = (typeof ALL_SITE_LOCALES)[number];

export const defaultSiteLocale: Record<Locale, SiteLocale> = {
  es: "es-ve",
  en: "en-us",
};

export function isLocale(value: string): value is Locale {
  return value === "es" || value === "en";
}

export function isSiteLocale(value: string): value is SiteLocale {
  return (SITE_LOCALES as readonly string[]).includes(value);
}

export function isIndexedLocale(value: string): boolean {
  return (INDEXED_LOCALES as readonly string[]).includes(value);
}

export function languageOf(siteLocale: SiteLocale | string): Locale {
  return String(siteLocale).toLowerCase().startsWith("es") ? "es" : "en";
}

/** Country from Cloudflare, language from the browser. URL locale remains the source of truth. */
const COUNTRY_LOCALE: Record<string, SiteLocale> = {
  VE: "es-ve", CO: "es-co", MX: "es-mx", AR: "es-ar", ES: "es-es",
  BR: "pt-br", PT: "pt-pt", FR: "fr-fr", DE: "de-de", IT: "it-it",
  NL: "nl-nl", SE: "sv-se", DK: "da-dk", FI: "fi-fi", PL: "pl-pl",
  TR: "tr-tr", JP: "ja-jp", KR: "ko-kr", CN: "zh-cn", TW: "zh-cn",
};

const LANGUAGE_LOCALE: Record<string, SiteLocale> = {
  es: "es-ve", en: "en-us", pt: "pt-br", fr: "fr-fr", de: "de-de", it: "it-it",
  nl: "nl-nl", sv: "sv-se", da: "da-dk", fi: "fi-fi", pl: "pl-pl", tr: "tr-tr",
  ja: "ja-jp", ko: "ko-kr", zh: "zh-cn",
};

export function siteLocaleFromRequest(country: string | null, acceptLanguage: string | null): SiteLocale {
  const cc = (country ?? "").toUpperCase();
  const preferred = (acceptLanguage ?? "")
    .split(",")
    .map((part) => part.trim().split(";")[0].toLowerCase())
    .filter(Boolean);

  if (COUNTRY_LOCALE[cc]) return COUNTRY_LOCALE[cc];
  for (const tag of preferred) {
    const language = tag.split("-")[0];
    if (LANGUAGE_LOCALE[language]) return LANGUAGE_LOCALE[language];
  }
  return "en-us";
}

const pageSlugs: Record<string, Record<Locale, string>> = {
  guia: { es: "guia", en: "guide" },
  acerca: { es: "acerca", en: "about" },
  tienda: { es: "tienda", en: "store" },
  filosofia: { es: "filosofia", en: "philosophy" },
  recomendaciones: { es: "recomendaciones", en: "recommendations" },
  confianza: { es: "confianza", en: "trust" },
  contacto: { es: "contacto", en: "contact" },
  proyectos: { es: "proyectos", en: "projects" },
  privacidad: { es: "privacidad", en: "privacy" },
  areas: { es: "areas", en: "areas" },
};

export type PageKey = keyof typeof pageSlugs;

const sitePagePaths: Record<PageKey | "home", string> = {
  home: "home",
  guia: "guide",
  acerca: "about",
  tienda: "store",
  filosofia: "philosophy",
  recomendaciones: "recommendations",
  confianza: "trust",
  contacto: "contact",
  proyectos: "projects",
  privacidad: "privacy",
  areas: "areas",
};

const areaSlugs: Record<string, Record<Locale, string>> = {
  "desarrollo-de-software": { es: "desarrollo-de-software", en: "software-development" },
  "ingenieria-open-source": { es: "ingenieria-open-source", en: "open-source-engineering" },
  "tecnologias-e-integraciones": { es: "tecnologias-e-integraciones", en: "technologies-and-integrations" },
  "productos-tecnologicos": { es: "productos-tecnologicos", en: "technology-products" },
  "recomendacion-y-afiliacion": { es: "recomendacion-y-afiliacion", en: "recommendation-and-affiliation" },
  "consultoria-tecnica": { es: "consultoria-tecnica", en: "technical-consulting" },
};

export function getPageSlug(locale: Locale, page: PageKey): string {
  return pageSlugs[page][locale];
}

/** Legacy helper. Use sitePath for public URLs. */
export function getPagePath(locale: Locale, page: "guia" | "acerca" | "tienda"): string {
  return `/${locale}/${getPageSlug(locale, page)}`;
}

export function getPageKey(slug: string): PageKey | null {
  for (const [key, values] of Object.entries(pageSlugs)) {
    if (values.es === slug || values.en === slug) return key as PageKey;
  }
  return null;
}

export function getAreaSlug(locale: Locale, slug: string): string {
  return areaSlugs[slug]?.[locale] ?? slug;
}

export function getAreaKey(slug: string): string | null {
  for (const [key, values] of Object.entries(areaSlugs)) {
    if (values.es === slug || values.en === slug) return key;
  }
  return null;
}

export function sitePath(page: PageKey | "home", siteLocale: SiteLocale): string {
  return `/${sitePagePaths[page]}/${siteLocale}`;
}

export function siteAreaPath(areaSlug: string, siteLocale: SiteLocale): string {
  const key = getAreaKey(areaSlug) ?? areaSlug;
  return `/areas/${siteLocale}/${getAreaSlug(languageOf(siteLocale), key)}`;
}

export function siteProductPath(id: string, siteLocale: SiteLocale): string {
  return `/store/${siteLocale}/${id}`;
}

export function hrefForSiteLocale(href: string, siteLocale: SiteLocale): string {
  const match = href.match(/^\/(home|guide|about|store|philosophy|recommendations|trust|projects|contact|privacy|areas)\/[a-z]{2}-[a-z]{2}(\/.*)?$/i);
  if (match) return `/${match[1]}/${siteLocale}${match[2] ?? ""}`;
  return href;
}

export function localizedHref(locale: Locale | SiteLocale, href: string): string {
  if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) return href;
  const siteLocale: SiteLocale = isSiteLocale(locale)
    ? locale
    : defaultSiteLocale[locale as Locale];

  if (href === "/") return sitePath("home", siteLocale);

  const match = href.match(/^\/([^/?#]+)(.*)$/);
  if (match) {
    const [, slug, rest = ""] = match;
    const key = getPageKey(slug);
    if (key) return `${sitePath(key, siteLocale)}${rest}`;

    if (slug === "areas") {
      const areaMatch = rest.match(/^\/([^/?#]+)(.*)$/);
      if (areaMatch) {
        const [, areaSlug, areaRest = ""] = areaMatch;
        return `${siteAreaPath(areaSlug, siteLocale)}${areaRest}`;
      }
      return `${sitePath("areas", siteLocale)}${rest}`;
    }
  }

  return `${sitePath("home", siteLocale)}${href}`;
}
