"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getContent } from "./content";
import styles from "./site.module.css";
import { siteUrl } from "./data";
import { getPagePath, type Locale } from "@/lib/i18n";
import type { StoreProductRecord } from "@/lib/store/types";

type Props = {
  locale: Locale;
  products: StoreProductRecord[];
};

const HERO_VIDEOS = [
  "/sites/0noxtackore/videos/hero_video_i.mp4",
  "/sites/0noxtackore/videos/hero_video_ii.mp4",
  "/sites/0noxtackore/videos/hero_video_iii.mp4",
];

export function Store({ locale, products: records }: Props) {
  const content = getContent(locale);
  const store = content.pages.tienda;
  const [category, setCategory] = useState<string>("all");
  const [heroVideo, setHeroVideo] = useState(0);
  const storePath = getPagePath(locale, "tienda");
  const storeUrl = `${siteUrl}${storePath}`;

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroVideo((v) => (v + 1) % HERO_VIDEOS.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  const products = useMemo(
    () =>
      records.map((p) => ({
        id: p.id,
        name: locale === "es" ? p.nameEs : p.nameEn,
        description: locale === "es" ? p.descriptionEs : p.descriptionEn,
        category: p.category,
        store: p.store,
        priceNote: locale === "es" ? p.priceNoteEs : p.priceNoteEn,
        url: p.affiliateUrl,
        image: p.imageUrl,
        badge: locale === "es" ? p.badgeEs : p.badgeEn,
      })),
    [locale, records],
  );

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  const filtered =
    category === "all" ? products : products.filter((p) => p.category === category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: store.title,
    description: store.description,
    url: storeUrl,
    inLanguage: locale === "es" ? "es-CO" : "en",
    isPartOf: { "@id": `${siteUrl}/#website` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.page}>
        <header className={styles.guideHeader}>
          <div className={styles.guideHeaderInner}>
            <Link href={`/${locale}`} className={styles.guideLogoLink}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sites/0noxtackore/logo.webp"
                alt="0NOXTACKORE"
                className={styles.guideLogo}
                width={180}
                height={36}
              />
            </Link>
            <Link href={`/${locale}`} className={styles.guideBack}>
              {store.back}
            </Link>
          </div>
        </header>

        <section className={styles.storeHero}>
          <div className={styles.storeHeroBg} aria-hidden="true">
            {HERO_VIDEOS.map((src, i) => (
              <video
                key={src}
                className={`${styles.storeHeroBgVideo} ${i === heroVideo ? styles.storeHeroBgVideoActive : ""}`}
                autoPlay
                muted
                loop
                playsInline
                preload={i === 0 ? "metadata" : "none"}
              >
                <source src={src} type="video/mp4" />
              </video>
            ))}
            <div className={styles.storeHeroOverlay} />
          </div>
          <div className={styles.storeHeroInner}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sites/0noxtackore/logo.webp"
              alt="0NOXTACKORE"
              className={styles.storeHeroLogo}
              width={220}
              height={44}
            />
            <p className={styles.storeHeroKicker}>{store.kicker}</p>
            <h1 className={styles.storeHeroTitle}>{store.title}</h1>
            <p className={styles.storeHeroLead}>{store.lead}</p>
            <div className={styles.storeTrustStrip}>
              {store.trustItems.map((item, i) => (
                <span key={item} className={styles.storeTrustItem}>
                  <span className={styles.storeTrustIcon} aria-hidden="true">
                    {i === 0 ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12.75 11.25 15 15 9.75"/><path d="M3.75 6.75 12 3l8.25 3.75v4.5c0 5.25-3.5 8.25-8.25 9.75-4.75-1.5-8.25-4.5-8.25-9.75z"/></svg>
                    ) : i === 1 ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12.75 11.25 15 15 9.75"/><circle cx="12" cy="12" r="9"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M16.5 7.5c0-1.66-2.01-3-4.5-3s-4.5 1.34-4.5 3 2.01 3 4.5 3 4.5 1.34 4.5 3-2.01 3-4.5 3-4.5-1.34-4.5-3"/></svg>
                    )}
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.storeCatalog}>
          <div className={styles.storeCatalogInner}>
            <div className={styles.storeCatalogTop}>
              <div>
                <p className={styles.storeCatalogEyebrow}>
                  {store.updatedLabel}: {store.updatedValue}
                </p>
                <h2 className={styles.storeCatalogTitle}>{store.title}</h2>
                <p className={styles.storeCatalogCount}>
                  {filtered.length} {locale === "es" ? (filtered.length === 1 ? "producto" : "productos") : (filtered.length === 1 ? "product" : "products")}
                </p>
              </div>
              {categories.length > 2 ? (
                <div className={styles.storeFilters}>
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`${styles.storeFilterBtn} ${category === c ? styles.storeFilterBtnActive : ""}`}
                    >
                      {c === "all" ? store.categories.all : c}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className={styles.storeDisclosureBar} role="note">
              <span className={styles.storeDisclosureIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                </svg>
              </span>
              <div>
                <strong className={styles.storeDisclosureTitle}>{store.disclosureTitle}</strong>
                <p className={styles.storeDisclosureText}>{store.disclosure}</p>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className={styles.guideSection}>
                <h2 className={styles.guideH2}>{store.emptyTitle}</h2>
                <p className={styles.guideP}>{store.emptyText}</p>
              </div>
            ) : (
              <div className={styles.storeGrid}>
                {filtered.map((product) => (
                  <article key={product.id} className={styles.storeCard}>
                    <Link
                      href={`${storePath}/${product.id}`}
                      className={styles.storeCardImageBtn}
                      aria-label={`${store.viewDetails}: ${product.name}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className={styles.storeCardImage}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {product.badge ? <span className={styles.storeBadge}>{product.badge}</span> : null}
                    </Link>
                    <div className={styles.storeCardBody}>
                      <p className={styles.storeCardMeta}>
                        {product.category} · {product.store}
                      </p>
                      <h3 className={styles.storeCardTitle}>
                        <Link href={`${storePath}/${product.id}`} className={styles.storeCardTitleLink}>
                          {product.name}
                        </Link>
                      </h3>
                      <p className={styles.storeCardDesc}>{product.description}</p>
                      <p className={styles.storeCardPrice}>{product.priceNote}</p>
                      <div className={styles.storeCardActions}>
                        <Link href={`${storePath}/${product.id}`} className={styles.storeDetailBtn}>
                          {store.viewDetails}
                        </Link>
                        <a
                          href={product.url}
                          target="_blank"
                          rel="nofollow sponsored noopener noreferrer"
                          className={styles.btnPrimary}
                        >
                          {store.externalCta.replace("{store}", product.store)}
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerBottom} style={{ borderTop: "none", paddingTop: 0 }}>
            <span>© {new Date().getFullYear()} 0NOXTACKORE</span>
            <span>{store.disclosureTitle}</span>
          </div>
        </footer>
      </div>
    </>
  );
}
