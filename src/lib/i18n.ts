export type Locale = "es" | "en";

export const locales: Locale[] = ["es", "en"];
export const defaultLocale: Locale = "es";

export function isLocale(value: string): value is Locale {
  return value === "es" || value === "en";
}

/**
 * Page slugs that differ by locale. Keys are canonical (Spanish) slugs.
 */
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
};

/** Area slugs that differ by locale. Keys are canonical (Spanish) slugs. */
const areaSlugs: Record<string, Record<Locale, string>> = {
  "desarrollo-de-software": { es: "desarrollo-de-software", en: "software-development" },
  "ingenieria-open-source": { es: "ingenieria-open-source", en: "open-source-engineering" },
  "tecnologias-e-integraciones": { es: "tecnologias-e-integraciones", en: "technologies-and-integrations" },
  "productos-tecnologicos": { es: "productos-tecnologicos", en: "technology-products" },
  "recomendacion-y-afiliacion": { es: "recomendacion-y-afiliacion", en: "recommendation-and-affiliation" },
  "consultoria-tecnica": { es: "consultoria-tecnica", en: "technical-consulting" },
};

export type PageKey = keyof typeof pageSlugs;

export function getPageSlug(locale: Locale, page: PageKey): string {
  return pageSlugs[page][locale];
}

export function getPagePath(locale: Locale, page: "guia" | "acerca" | "tienda"): string {
  return `/${locale}/${getPageSlug(locale, page)}`;
}

/** Map a slug (any locale) back to its canonical page key, if translatable. */
export function getPageKey(slug: string): PageKey | null {
  for (const [key, values] of Object.entries(pageSlugs)) {
    if (values.es === slug || values.en === slug) return key as PageKey;
  }
  return null;
}

export function getAreaSlug(locale: Locale, slug: string): string {
  return areaSlugs[slug]?.[locale] ?? slug;
}

/** Map an area slug (any locale) back to its canonical Spanish slug. */
export function getAreaKey(slug: string): string | null {
  for (const [key, values] of Object.entries(areaSlugs)) {
    if (values.es === slug || values.en === slug) return key;
  }
  return null;
}

export function localizedHref(locale: Locale, href: string): string {
  if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
    return href;
  }
  if (href === "/") return `/${locale}`;

  // Translate known page slugs while preserving hash/query suffixes.
  const match = href.match(/^\/([^/?#]+)(.*)$/);
  if (match) {
    const [, slug, rest] = match;
    const key = getPageKey(slug);
    if (key) return `/${locale}/${getPageSlug(locale, key)}${rest}`;

    if (slug === "areas") {
      const areaMatch = rest.match(/^\/([^/?#]+)(.*)$/);
      if (areaMatch) {
        const [, areaSlug, areaRest] = areaMatch;
        const areaKey = getAreaKey(areaSlug);
        if (areaKey) return `/${locale}/areas/${getAreaSlug(locale, areaKey)}${areaRest}`;
      }
      return `/${locale}/areas${rest}`;
    }
  }

  return `/${locale}${href}`;
}
