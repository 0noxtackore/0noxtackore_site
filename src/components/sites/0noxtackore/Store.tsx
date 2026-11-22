"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { getContent } from "./content";
import styles from "./site.module.css";
import { siteUrl } from "./data";
import { getPagePath, type Locale } from "@/lib/i18n";

export function Store({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const store = content.pages.tienda;
  const [category, setCategory] = useState<string>("all");
  const storeUrl = `${siteUrl}${getPagePath(locale, "tienda")}`;

  const categories = useMemo(() => {
    const unique = Array.from(new Set(store.products.map((p) => p.category)));
    return ["all", ...unique];
  }, [store.products]);

  const products =
    category === "all" ? store.products : store.products.filter((p) => p.category === category);

  const structuredData = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${storeUrl}#webpage`,
      url: storeUrl,
      name: store.title,
      description: store.description,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      inLanguage: locale,
      dateModified: "2026-11-22T00:00:00Z",
    },
    {
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
          name: store.title,
          item: storeUrl,
        },
      ],
    },
  ]).replace(/</g, "\\u003c");

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />

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
            {store.back}
          </Link>
        </div>
      </header>

      <section className={styles.guideHero}>
        <div className={styles.guideHeroInner}>
          <div className={styles.guideKicker}>{store.kicker}</div>
          <h1 className={styles.guideTitle}>{store.title}</h1>
          <p className={styles.guideLead}>{store.description}</p>
          <p className={styles.guideMeta}>
            <span className={styles.thinBrand}>{content.brand.name}</span> · {store.updatedLabel}: {store.updatedValue}
          </p>
        </div>
      </section>

      <div className={styles.guideLayout}>
        <main className={styles.guideMain}>
          <section className={styles.guideSection}>
            <p className={styles.guideP}>{store.lead}</p>
            <div className={styles.guideCallout}>
              <strong>{store.disclosureTitle}:</strong> {store.disclosure}
            </div>
          </section>

          <section className={styles.guideSection}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {categories.map((cat) => {
                const label = cat === "all" ? store.categories.all : cat;
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`${styles.button} ${active ? styles.buttonBlue : ""}`}
                    style={!active ? { background: "#fff", color: "var(--ink)", border: "1px solid #d1d1d1" } : undefined}
                    aria-pressed={active}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {products.length > 0 ? (
              <div className={styles.cardGrid}>
                {products.map((product) => (
                  <article key={`${product.store}-${product.name}`} className={styles.card}>
                    <div className={styles.cardBody}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--blue)" }}>
                          {product.store}
                        </span>
                        {product.badge ? (
                          <span style={{ fontSize: 12, color: "var(--muted)" }}>· {product.badge}</span>
                        ) : null}
                      </div>
                      <h2 className={styles.cardTitle} style={{ marginBottom: 8 }}>{product.name}</h2>
                      <p className={styles.guideP} style={{ marginBottom: 16 }}>{product.description}</p>
                      <p style={{ fontSize: 13, color: "var(--muted)", marginTop: "auto", marginBottom: 16 }}>
                        {product.category} · {product.priceNote}
                      </p>
                      <a
                        className={`${styles.button} ${styles.buttonBlue}`}
                        href={product.url}
                        target="_blank"
                        rel="sponsored nofollow noopener noreferrer"
                        onClick={() => {
                          if (typeof window !== "undefined" && typeof window.gtag === "function") {
                            window.gtag("event", "affiliate_click", {
                              item_name: product.name,
                              store: product.store,
                              category: product.category,
                              locale,
                            });
                          }
                        }}
                      >
                        {store.externalCta.replace("{store}", product.store)}
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.guideStoreNotice}>
                <h2 className={styles.guideH2}>{store.emptyTitle}</h2>
                <p className={styles.guideP}>{store.emptyText}</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
