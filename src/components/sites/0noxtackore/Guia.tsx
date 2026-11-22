"use client";

import Link from "next/link";

import { getContent } from "./content";
import { ShareButtons } from "./ShareButtons";
import styles from "./site.module.css";
import { siteUrl } from "./data";
import { getPagePath, type Locale } from "@/lib/i18n";

export function Guia({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const guide = content.pages.guia;
  const { share } = content;
  const guideUrl = `${siteUrl}${getPagePath(locale, "guia")}`;
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    image: new URL(content.ogImage, siteUrl).toString(),
    author: {
      "@type": "Person",
      name: "Angello Aponte",
      jobTitle: locale === "es" ? "Fundador y CEO" : "Founder & CEO",
      worksFor: { "@type": "Organization", name: content.brand.name, url: siteUrl },
    },
    publisher: { "@type": "Organization", name: content.brand.name, url: siteUrl },
    datePublished: "2026-11-19T00:00:00Z",
    dateModified: "2026-11-21T00:00:00Z",
    mainEntityOfPage: guideUrl,
    inLanguage: locale,
  }).replace(/</g, "\\u003c");
  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "es" ? "Inicio" : "Home",
        item: `${siteUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: guide.title,
        item: guideUrl,
      },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
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
            {guide.back}
          </Link>
        </div>
      </header>

      <section className={styles.guideHero}>
        <div className={styles.guideHeroInner}>
          <div className={styles.guideKicker}>{guide.kicker}</div>
          <h1 className={styles.guideTitle}>{guide.title}</h1>
          <p className={styles.guideLead}>{guide.description}</p>
          <p className={styles.guideMeta}>
            {locale === "es" ? "Por " : "By "}
            <span className={styles.thinBrand}>Angello Aponte</span> · {guide.readingTime} ·{" "}
            {locale === "es" ? "Actualizado: 21 nov 2026" : "Updated: Nov 21, 2026"}
          </p>
        </div>
      </section>

      <div className={styles.guideLayout}>
        <main className={styles.guideMain}>
          <section className={styles.guideSection} id="uso">
            <h2 className={styles.guideH2}>{guide.sections[0].title}</h2>
            <p className={styles.guideP}>{guide.body[0]}</p>
          </section>

          <section className={styles.guideSection} id="procesador">
            <h2 className={styles.guideH2}>{guide.sections[1].title}</h2>
            <p className={styles.guideP}>{guide.body[1]}</p>
          </section>

          <section className={styles.guideSection} id="ram">
            <h2 className={styles.guideH2}>{guide.sections[2].title}</h2>
            <p className={styles.guideP}>{guide.body[2]}</p>
          </section>

          <section className={styles.guideSection} id="pantalla">
            <h2 className={styles.guideH2}>{guide.sections[3].title}</h2>
            <p className={styles.guideP}>{guide.body[3]}</p>
          </section>

          <section className={styles.guideSection} id="checklist">
            <h2 className={styles.guideH2}>{guide.sections[4].title}</h2>
            <p className={styles.guideP}>{guide.checklistIntro}</p>
            <ul className={styles.guideChecklist}>
              {guide.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className={styles.guideSection} id="criterios">
            <h2 className={styles.guideH2}>{guide.sections[5].title}</h2>
            <p className={styles.guideP}>{guide.criteriaIntro}</p>
            <p className={styles.guideCallout}>{guide.criteriaNote}</p>
          </section>

          <section className={styles.guideStoreNotice}>
            <h2 className={styles.guideH2}>{guide.storeTitle}</h2>
            <p className={styles.guideP}>{guide.storeText}</p>
            <Link className={`${styles.button} ${styles.buttonBlue}`} href={getPagePath(locale, "tienda")}>
              {guide.storeCta}
            </Link>
          </section>
        </main>

        <aside className={styles.guideAside}>
          <div className={styles.guideToc}>
            <div className={styles.guideTocTitle}>{guide.tocTitle}</div>
            {guide.sections.map((section) => (
              <a key={section.id} className={styles.guideTocLink} href={`#${section.id}`}>
                {section.title}
              </a>
            ))}
          </div>
        </aside>
      </div>

      <section className={styles.guideShare}>
        <div className={styles.guideShareInner}>
          <h2 className={styles.guideH2}>{guide.shareHeading}</h2>
          <p className={styles.guideP}>{guide.shareText}</p>
          <ShareButtons
            url={guideUrl}
            text={guide.description}
            labels={{ copy: share.labels.copy, copied: share.labels.copied, shareOn: share.labels.shareOn }}
          />
        </div>
      </section>
    </div>
  );
}
