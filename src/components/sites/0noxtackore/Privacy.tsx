"use client";

import Link from "next/link";

import { getContent } from "./content";
import styles from "./site.module.css";
import { siteUrl } from "./data";
import { localizedHref, type Locale } from "@/lib/i18n";

export function Privacy({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const page = content.pages.privacidad;
  const canonical = localizedHref(locale, "/privacidad");

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: page.title,
            description: page.description,
            url: `${siteUrl}${canonical}`,
            inLanguage: locale === "es" ? "es-CO" : "en",
          }).replace(/</g, "\\u003c"),
        }}
      />
      <header className={styles.guideHeader}>
        <div className={styles.guideHeaderInner}>
          <Link className={styles.guideLogoLink} href={`/${locale}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sites/0noxtackore/logo.webp" alt="0NOXTACKORE" className={styles.guideLogo} width={180} height={36} />
          </Link>
          <Link href={`/${locale}`} className={styles.guideBack}>
            {locale === "es" ? "Volver al inicio" : "Back to home"}
          </Link>
        </div>
      </header>
      <main>
        <section className={styles.guideSection}>
          <div className={styles.sectionKicker}>{page.kicker}</div>
          <h1 className={styles.guideH2}>{page.title}</h1>
          <p className={styles.guideP}>{page.lead}</p>
          {page.sections.map((section) => (
            <div key={section.title} style={{ marginTop: 24 }}>
              <h2 className={styles.cardTitle}>{section.title}</h2>
              <p className={styles.guideP}>{section.description}</p>
            </div>
          ))}
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
