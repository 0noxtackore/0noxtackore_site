export type Locale = "es" | "en";

export const locales: Locale[] = ["es", "en"];
export const defaultLocale: Locale = "es";

export function isLocale(value: string): value is Locale {
  return value === "es" || value === "en";
}

export function localizedHref(locale: Locale, href: string): string {
  if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
    return href;
  }
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}
