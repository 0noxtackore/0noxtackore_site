"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { getContent } from "./content";
import styles from "./site.module.css";
import { siteUrl } from "./data";
import { defaultSiteLocale, sitePath, type Locale, type SiteLocale } from "@/lib/i18n";
import type { StoreProductRecord } from "@/lib/store/types";
import { withAffiliateTracking } from "@/lib/store/affiliate";
import { categoryLabel } from "@/lib/store/category-labels";

type Props = {
  locale: Locale;
  product: StoreProductRecord;
  similar: StoreProductRecord[];
};

function mapProduct(p: StoreProductRecord, locale: Locale, siteLocale: SiteLocale) {
  const translated = p.translations?.[siteLocale];
  return {
    id: p.id,
    name: translated?.name || (locale === "es" ? p.nameEs : p.nameEn),
    description: translated?.description || (locale === "es" ? p.descriptionEs : p.descriptionEn),
    category: p.category,
    store: p.store,
    priceNote: locale === "es" ? p.priceNoteEs : p.priceNoteEn,
    url: withAffiliateTracking(p.affiliateUrl, p.store),
    image: p.imageUrl,
    badge: locale === "es" ? p.badgeEs : p.badgeEn,
  };
}

function truncateText(value: string, maxLength: number) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

export function ProductDetail({ locale, product: record, similar, siteLocale = defaultSiteLocale[locale] }: Props & { siteLocale?: SiteLocale }) {
  const content = getContent(locale, siteLocale);
  const store = content.pages.tienda;
  const product = mapProduct(record, locale, siteLocale);
  const similarProducts = similar.map((p) => mapProduct(p, locale, siteLocale));
  const storePath = sitePath("tienda", siteLocale);
  const productUrl = `${siteUrl}${storePath}/${product.id}`;
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.category,
    brand: { "@type": "Brand", name: product.store },
    url: productUrl,
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
            <Link href={sitePath("home", siteLocale)} className={styles.guideLogoLink}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sites/0noxtackore/logo.webp"
                alt="0NOXTACKORE"
                className={styles.guideLogo}
                width={180}
                height={36}
              />
            </Link>
            <Link href={storePath} className={styles.guideBack}>
              {store.backToStore}
            </Link>
          </div>
        </header>

        <section className={styles.productDetail}>
          <div className={styles.productDetailMedia}>
            <button type="button" className={styles.productDetailImageBtn} onClick={() => setLightbox(true)} aria-label={locale === "es" ? "Ver imagen en pantalla completa" : "View image fullscreen"}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className={styles.productDetailImage}
                style={{
                  boxSizing: "border-box",
                  objectFit: "contain",
                  borderRadius: 0,
                  border: "2px solid royalblue",
                  padding: 0,
                }}
              />
            </button>
          </div>
          <div className={styles.productDetailBody}>
            <p className={styles.storeCardMeta}>
              {categoryLabel(product.category, locale)} · {product.store}
            </p>
            {product.badge ? <span className={styles.storeModalBadge}>{product.badge}</span> : null}
            <h1 className={styles.productDetailTitle}>{product.name}</h1>
            <p className={styles.productDetailDesc}>{product.description}</p>
            <p className={styles.storeCardPrice}>{product.priceNote}</p>
            <div className={styles.storeCardActions}>
              <a
                href={product.url}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className={styles.btnPrimary}
              >
                {store.externalCta.replace("{store}", product.store)}
              </a>
            </div>
            <div className={styles.guideCallout} style={{ marginTop: 24 }}>
              <strong>{store.disclosureTitle}:</strong> {store.disclosure}
            </div>
          </div>
        </section>

        {similarProducts.length > 0 ? (
          <section className={styles.similarSection}>
            <div className={styles.similarInner}>
              <h2 className={styles.guideH2}>{store.similarTitle}</h2>
              <div className={styles.storeGrid}>
                {similarProducts.map((p) => (
                  <article key={p.id} className={styles.storeCard}>
                    <Link href={`${storePath}/${p.id}`} className={styles.storeCardImageBtn}>
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 700px) 50vw, (max-width: 980px) 33vw, 25vw"
                        quality={70}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        className={styles.storeCardImage}
                        style={{
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          boxSizing: "border-box",
                          objectFit: "contain",
                          borderRadius: 0,
                          border: "2px solid royalblue",
                          padding: 0,
                        }}
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                      {p.badge ? <span className={styles.storeBadge}>{p.badge}</span> : null}
                    </Link>
                    <div className={styles.storeCardBody}>
                      <p className={styles.storeCardMeta}>
                        {categoryLabel(p.category, locale)} · {p.store}
                      </p>
                      <h3 className={styles.storeCardTitle}>{truncateText(p.name, 60)}</h3>
                      <p className={styles.storeCardDesc}>{truncateText(p.description, 100)}</p>
                      <p className={styles.storeCardPrice}>{p.priceNote}</p>
                      <div className={styles.storeCardActions}>
                        <Link href={`${storePath}/${p.id}`} className={styles.storeDetailBtn}>
                          {store.viewDetails}
                        </Link>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="nofollow sponsored noopener noreferrer"
                          className={styles.btnPrimary}
                        >
                          {store.externalCta.replace("{store}", p.store)}
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {lightbox ? (
          <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={product.name} onClick={() => setLightbox(false)}>
            <button type="button" className={styles.lightboxClose} onClick={() => setLightbox(false)} aria-label={locale === "es" ? "Cerrar" : "Close"}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name} className={styles.lightboxImage} onClick={(e) => e.stopPropagation()} />
          </div>
        ) : null}

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
