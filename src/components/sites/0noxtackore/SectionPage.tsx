"use client";

import Link from "next/link";

import { getContent } from "./content";
import styles from "./site.module.css";
import { sectionMeta, type SectionKey } from "./section-meta";
import { defaultSiteLocale, siteAreaPath, sitePath, type Locale, type SiteLocale } from "@/lib/i18n";

const SOCIALS = [
  { label: "YouTube", href: "https://www.youtube.com/@0noxtackore" },
  { label: "Facebook", href: "https://www.facebook.com/people/0noxtackore/61567098773222/" },
  { label: "Instagram", href: "https://www.instagram.com/0noxtackore.dev/" },
];

export function SectionPage({ locale, section, siteLocale = defaultSiteLocale[locale] }: { locale: Locale; section: SectionKey; siteLocale?: SiteLocale }) {
  const content = getContent(locale);
  const meta = sectionMeta(locale, section);
  const back = locale === "es" ? "Volver al inicio" : "Back to home";

  return (
    <div className={styles.page}>
      <header className={styles.guideHeader}>
        <div className={styles.guideHeaderInner}>
          <Link className={styles.guideLogoLink} href={sitePath("home", siteLocale)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sites/0noxtackore/logo.webp" alt="0NOXTACKORE" className={styles.guideLogo} width={180} height={36} />
          </Link>
          <Link href={sitePath("home", siteLocale)} className={styles.guideBack}>{back}</Link>
        </div>
      </header>

      <main>
        <section className={styles.guideSection}>
          <div className={styles.sectionKicker}>{content.brand.tagline}</div>
          <h1 className={styles.guideH2}>{meta.title}</h1>
          <p className={styles.guideP}>{meta.description}</p>

          {section === "filosofia" && (
            <>
              {content.philosophy.paragraphs.map((paragraph) => <p key={paragraph} className={styles.guideP}>{paragraph}</p>)}
              <p className={styles.guideP}><strong>{content.philosophy.statement}</strong></p>
            </>
          )}

          {section === "recomendaciones" && (
            <>
              {content.recommendation.paragraphs.map((paragraph) => <p key={paragraph} className={styles.guideP}>{paragraph}</p>)}
              <div className={styles.chips}>
                {content.recommendation.highlights.map((item) => <span key={item} className={styles.chip}>{item}</span>)}
              </div>
              <Link className={`${styles.button} ${styles.buttonBlue}`} href={sitePath("guia", siteLocale)}>
                {content.ui.readGuide}
              </Link>
            </>
          )}

          {section === "confianza" && (
            <div className={styles.valueGrid}>
              {content.trust.map((item, index) => (
                <article key={item.title} className={styles.valueCard}>
                  <span className={styles.valueNumber}>0{index + 1}</span>
                  <h2 className={styles.valueTitle}>{item.title}</h2>
                  <p className={styles.valueText}>{item.description}</p>
                </article>
              ))}
            </div>
          )}

          {section === "proyectos" && (
            <div className={styles.projectGrid}>
              {content.projects.map((project) => (
                <a key={project.name} className={styles.projectCard} href={project.url} target="_blank" rel="noreferrer">
                  <div className={styles.projectTop}>
                    <h2 className={styles.projectName}>{project.name} →</h2>
                    <span className={styles.projectStatus}>{project.status}</span>
                  </div>
                  <p className={styles.guideP}>{project.description}</p>
                </a>
              ))}
            </div>
          )}

          {section === "contacto" && (
            <>
              <p className={styles.guideP}>{meta.description}</p>
              <div className={styles.valueGrid}>
                {SOCIALS.map((social) => (
                  <a key={social.label} className={styles.projectCard} href={social.href} target="_blank" rel="noreferrer">
                    <h2 className={styles.projectName}>{social.label} →</h2>
                  </a>
                ))}
              </div>
            </>
          )}

          {section === "areas" && (
            <div className={styles.cardGrid}>
              {content.areas.map((area) => (
                <Link key={area.slug} className={styles.card} href={siteAreaPath(area.slug, siteLocale)}>
                  <h2 className={styles.cardTitle}>{area.title}</h2>
                  <p className={styles.cardText}>{area.description}</p>
                </Link>
              ))}
            </div>
          )}
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
