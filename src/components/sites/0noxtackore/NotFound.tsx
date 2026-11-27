import Link from "next/link";

import { defaultSiteLocale, sitePath, type Locale, type SiteLocale } from "@/lib/i18n";
import styles from "./site.module.css";
import { getContent } from "./content";

export function NotFoundContent({ locale, siteLocale = defaultSiteLocale[locale] }: { locale: Locale; siteLocale?: SiteLocale }) {
  const content = getContent(locale, siteLocale);
  const isEs = locale === "es";

  return (
    <div className={styles.page}>
      <header className={styles.guideHeader}>
        <div className={styles.guideHeaderInner}>
          <Link className={styles.guideLogoLink} href={sitePath("home", siteLocale)} aria-label={content.brand.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.guideLogo}
              src="/sites/0noxtackore/logo.webp"
              alt={content.brand.name}
              width={280}
              height={87}
              decoding="async"
            />
          </Link>
        </div>
      </header>

      <main className={styles.guideHero} style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
        <div className={styles.guideHeroInner}>
          <div className={styles.guideKicker}>404</div>
          <h1 className={styles.guideTitle}>
            {isEs ? "Página no encontrada" : "Page not found"}
          </h1>
          <p className={styles.guideLead}>
            {isEs
              ? "La página que buscas no existe, fue movida o la URL es incorrecta."
              : "The page you're looking for doesn't exist, was moved, or the URL is incorrect."}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <Link className={`${styles.button} ${styles.buttonBlue}`} href={sitePath("home", siteLocale)}>
              {isEs ? "Ir al inicio" : "Go home"}
            </Link>
            <Link className={styles.button} style={{ background: "#fff", color: "var(--ink)", border: "1px solid #d1d1d1" }} href={sitePath("tienda", siteLocale)}>
              {isEs ? "Ver tienda" : "View store"}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
