"use client";

import Link from "next/link";

import { getContent } from "./content";
import styles from "./site.module.css";
import type { Locale } from "@/lib/i18n";

const officialLinks = [
  { label: "GitHub", url: "https://github.com/0noxtackore" },
  { label: "YouTube", url: "https://www.youtube.com/@0noxtackore" },
  {
    label: "Facebook",
    url: "https://www.facebook.com/people/0noxtackore/61567098773222/",
  },
  { label: "Instagram", url: "https://www.instagram.com/0noxtackore.dev/" },
];

export function About({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const about = content.pages.acerca;
  const aboutUrl = `${content.baseUrl}/acerca`;

  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: about.title,
    url: aboutUrl,
    mainEntity: {
      "@type": "Organization",
      name: content.brand.name,
      url: content.baseUrl,
      logo: `${content.baseUrl}/sites/0noxtackore/logo.webp`,
      foundingDate: "2026",
      areaServed: { "@type": "Place", name: "Global" },
      founder: {
        "@type": "Person",
        name: about.ceoName,
      },
      sameAs: officialLinks.map((l) => l.url),
    },
    inLanguage: locale,
  }).replace(/</g, "\\u003c");

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <header className={styles.guideHeader}>
        <div className={styles.guideHeaderInner}>
          <Link className={styles.guideLogoLink} href={`/${locale}`} aria-label={content.brand.name}>
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
          <Link className={styles.guideBack} href={`/${locale}`}>
            {about.back}
          </Link>
        </div>
      </header>

      <section className={styles.guideHero}>
        <div className={styles.guideHeroInner}>
          <div className={styles.guideKicker}>{about.kicker}</div>
          <h1 className={styles.guideTitle}>{about.title}</h1>
          <p className={styles.guideLead}>{about.lead}</p>
          <p className={styles.guideMeta}>
            <span className={styles.thinBrand}>{content.brand.name}</span> · {content.brand.tagline}
          </p>
        </div>
      </section>

      <div className={styles.guideLayout}>
        <main className={styles.guideMain}>
          <section className={styles.guideSection} id="origen">
            <h2 className={styles.guideH2}>{about.originTitle}</h2>
            {about.originParagraphs.map((paragraph, index) => (
              <p key={index} className={styles.guideP}>
                {paragraph}
              </p>
            ))}
          </section>

          <section className={styles.guideSection}>
            <h2 className={styles.guideH2}>{about.whoTitle}</h2>
            {about.whoParagraphs.map((paragraph) => (
              <p key={paragraph} className={styles.guideP}>
                {paragraph}
              </p>
            ))}
          </section>

          <section className={styles.guideSection} id="ceo">
            <h2 className={styles.guideH2}>{about.ceoTitle}</h2>
            <p className={styles.guideMeta}>
              <span className={styles.thinBrand}>{about.ceoName}</span> — {about.ceoRole}
            </p>
            {about.ceoParagraphs.map((paragraph, index) => (
              <p key={index} className={styles.guideP}>
                {paragraph}
              </p>
            ))}
          </section>

          <section className={styles.guideSection}>
            <h2 className={styles.guideH2}>{about.buildTitle}</h2>
            <p className={styles.guideP}>{about.buildIntro}</p>
            <div className={styles.aboutProjects}>
              {about.projects.map((project) => (
                <a
                  key={project.name}
                  className={styles.aboutProject}
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <h3 className={styles.aboutProjectName}>{project.name} ↗</h3>
                  <p className={styles.aboutProjectText}>{project.description}</p>
                </a>
              ))}
            </div>
          </section>

          <section className={styles.guideSection}>
            <h2 className={styles.guideH2}>{about.philosophyTitle}</h2>
            <p className={styles.guideP}>{about.philosophyText}</p>
          </section>

          <section className={styles.guideSection}>
            <h2 className={styles.guideH2}>{about.officialTitle}</h2>
            <p className={styles.guideP}>{about.officialText}</p>
            <div className={styles.aboutLinks}>
              {officialLinks.map((link) => (
                <a
                  key={link.label}
                  className={styles.aboutLink}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </section>
        </main>

        <aside className={styles.guideAside}>
          <div className={styles.guideToc}>
            <div className={styles.guideTocTitle}>{about.tocTitle}</div>
            {about.toc.map((item) => (
              <Link key={item.label} className={styles.guideTocLink} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
