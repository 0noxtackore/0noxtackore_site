"use client";

import Link from "next/link";

import { getContent } from "./content";
import styles from "./site.module.css";
import { defaultSiteLocale, sitePath, type Locale, type SiteLocale } from "@/lib/i18n";

export function AreaPage({ locale, areaSlug, siteLocale = defaultSiteLocale[locale] }: { locale: Locale; areaSlug: string; siteLocale?: SiteLocale }) {
  const content = getContent(locale);
  const area = content.areas.find((item) => item.slug === areaSlug);
  const back = locale === "es" ? "Volver a áreas" : "Back to areas";

  if (!area) {
    return (
      <main className={styles.guideSection}>
        <h1 className={styles.guideH2}>{locale === "es" ? "Área no encontrada" : "Area not found"}</h1>
        <Link href={sitePath("areas", siteLocale)} className={styles.button}>{back}</Link>
      </main>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.guideHeader}>
        <div className={styles.guideHeaderInner}>
          <Link className={styles.guideLogoLink} href={sitePath("home", siteLocale)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sites/0noxtackore/logo.webp" alt="0NOXTACKORE" className={styles.guideLogo} width={180} height={36} />
          </Link>
          <Link href={sitePath("areas", siteLocale)} className={styles.guideBack}>{back}</Link>
        </div>
      </header>
      <main>
        <section className={styles.guideSection}>
          <div className={styles.sectionKicker}>{content.ui.areasKicker}</div>
          <h1 className={styles.guideH2}>{area.title}</h1>
          <p className={styles.guideP}>{area.description}</p>
          <div className={styles.cardMedia} style={{ maxWidth: 760, borderRadius: 16, overflow: "hidden", marginTop: 24 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={area.image} alt={area.alt} loading="lazy" decoding="async" width={960} height={536} className={styles.cardImage} />
          </div>
          <div style={{ marginTop: 24 }}>
            <Link className={`${styles.button} ${styles.buttonBlue}`} href={sitePath("contacto", siteLocale)}>
              {content.ui.contact}
            </Link>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerBottom} style={{ borderTop: "none", paddingTop: 0 }}>
          <span>© {new Date().getFullYear()} 0NOXTACKORE</span>
          <span>{content.brand.tagline}</span>
        </div>
      </footer>
    </div>
  );
}
