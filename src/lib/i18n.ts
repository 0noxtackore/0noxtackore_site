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
};

export function getPageSlug(locale: Locale, page: "guia" | "acerca" | "tienda"): string {
  return pageSlugs[page][locale];
}

export function getPagePath(locale: Locale, page: "guia" | "acerca" | "tienda"): string {
  return `/${locale}/${getPageSlug(locale, page)}`;
}

/** Map a slug (any locale) back to its canonical page key, if translatable. */
export function getPageKey(slug: string): "guia" | "acerca" | "tienda" | null {
  if (slug === "guia" || slug === "guide") return "guia";
  if (slug === "acerca" || slug === "about") return "acerca";
  if (slug === "tienda" || slug === "store") return "tienda";
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
  }

  return `/${locale}${href}`;
}
