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

type SortKey = "recommended" | "name" | "store";

export function Store({ locale, products: records }: Props) {
  const content = getContent(locale);
  const store = content.pages.tienda;
  const [category, setCategory] = useState<string>("all");
  const [storeFilter, setStoreFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("recommended");
  const [query, setQuery] = useState("");
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

  const categories = useMemo(() => ["all", ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const stores = useMemo(() => ["all", ...Array.from(new Set(products.map((p) => p.store)))], [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (storeFilter === "all" || p.store === storeFilter) &&
        (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.store.toLowerCase().includes(q)),
    );
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, locale));
    if (sort === "store") list = [...list].sort((a, b) => a.store.localeCompare(b.store) || a.name.localeCompare(b.name, locale));
    return list;
  }, [products, category, storeFilter, sort, locale, query]);

  const activeCategoryLabel = category === "all" ? store.allCategories : category;
  const hasActiveFilters = category !== "all" || storeFilter !== "all" || sort !== "recommended" || query.trim() !== "";

  const clearFilters = () => {
    setCategory("all");
    setStoreFilter("all");
    setSort("recommended");
    setQuery("");
  };

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={styles.page}>
        <header className={styles.guideHeader}>
          <div className={styles.guideHeaderInner}>
            <Link href={`/${locale}`} className={styles.guideLogoLink}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/sites/0noxtackore/logo.webp" alt="0NOXTACKORE" className={styles.guideLogo} width={180} height={36} />
            </Link>
            <Link href={`/${locale}`} className={styles.guideBack}>{store.back}</Link>
          </div>
        </header>

        <section className={styles.storeHero}>
          <div className={styles.storeHeroBg} aria-hidden="true">
            {HERO_VIDEOS.map((src, i) => (
              <video key={src} className={`${styles.storeHeroBgVideo} ${i === heroVideo ? styles.storeHeroBgVideoActive : ""}`} autoPlay muted loop playsInline preload={i === 0 ? "metadata" : "none"}>
                <source src={src} type="video/mp4" />
              </video>
            ))}
            <div className={styles.storeHeroOverlay} />
          </div>
          <div className={styles.storeHeroInner}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sites/0noxtackore/logo.webp" alt="0NOXTACKORE" className={styles.storeHeroLogo} width={220} height={44} />
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
            <div className={styles.storeDisclosureBar} role="note">
              <span className={styles.storeDisclosureIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
              </span>
              <div>
                <strong className={styles.storeDisclosureTitle}>{store.disclosureTitle}</strong>
                <p className={styles.storeDisclosureText}>{store.disclosure}</p>
              </div>
            </div>

            <div className={styles.storeCategoryRail} aria-label={store.allCategories}>
              {categories.map((c) => (
                <button key={c} type="button" onClick={() => setCategory(c)} className={`${styles.storeCategoryChip} ${category === c ? styles.storeCategoryChipActive : ""}`}>
                  {c === "all" ? store.allCategories : c}
                </button>
              ))}
            </div>

            <div className={styles.storeCatalogLayout}>
              <aside className={styles.storeFiltersAside} aria-label={store.filtersTitle}>
                <div className={styles.storeFiltersHead}>
                  <h2 className={styles.storeFiltersTitle}>{store.filtersTitle}</h2>
                  {hasActiveFilters ? (
                    <button type="button" className={styles.storeClearBtn} onClick={clearFilters}>{store.clearFilters}</button>
                  ) : null}
                </div>

                <div className={styles.storeFilterGroup}>
                  <div className={styles.storeFilterGroupTitle}>{store.storeLabel}</div>
                  {stores.map((s) => (
                    <label key={s} className={styles.storeFilterOption}>
                      <input type="radio" name="store-filter" checked={storeFilter === s} onChange={() => setStoreFilter(s)} />
                      <span>{s === "all" ? store.categories.all : s}</span>
                    </label>
                  ))}
                </div>

                <div className={styles.storeFilterGroup}>
                  <div className={styles.storeFilterGroupTitle}>{locale === "es" ? "Categoría" : "Category"}</div>
                  {categories.map((c) => (
                    <label key={c} className={styles.storeFilterOption}>
                      <input type="radio" name="category-filter" checked={category === c} onChange={() => setCategory(c)} />
                      <span>{c === "all" ? store.allCategories : c}</span>
                    </label>
                  ))}
                </div>
              </aside>

              <div className={styles.storeCatalogMain}>
                <div className={styles.storeToolbar}>
                  <div>
                    <p className={styles.storeToolbarTitle}>{activeCategoryLabel} <span className={styles.storeToolbarCount}>({filtered.length})</span></p>
                    <p className={styles.storeCatalogEyebrow}>{store.updatedLabel}: {store.updatedValue}</p>
                  </div>
                  <div className={styles.storeToolbarControls}>
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={locale === "es" ? "Buscar producto..." : "Search products..."}
                      className={styles.storeSearchInput}
                      aria-label={locale === "es" ? "Buscar producto" : "Search products"}
                    />
                    <label className={styles.storeSort}>
                      <span>{store.sortLabel}</span>
                      <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={styles.storeSortSelect}>
                        <option value="recommended">{store.sortRecommended}</option>
                        <option value="name">{store.sortName}</option>
                        <option value="store">{store.sortStore}</option>
                      </select>
                    </label>
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
                        <Link href={`${storePath}/${product.id}`} className={styles.storeCardImageBtn} aria-label={`${store.viewDetails}: ${product.name}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.image} alt={product.name} loading="lazy" className={styles.storeCardImage} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                          {product.badge ? <span className={styles.storeBadge}>{product.badge}</span> : null}
                        </Link>
                        <div className={styles.storeCardBody}>
                          <p className={styles.storeCardMeta}>{product.category} · {product.store}</p>
                          <h3 className={styles.storeCardTitle}>
                            <Link href={`${storePath}/${product.id}`} className={styles.storeCardTitleLink}>{product.name}</Link>
                          </h3>
                          <p className={styles.storeCardDesc}>{product.description}</p>
                          <p className={styles.storeCardPrice}>{product.priceNote}</p>
                          <div className={styles.storeCardActions}>
                            <Link href={`${storePath}/${product.id}`} className={styles.storeDetailBtn}>{store.viewDetails}</Link>
                            <a href={product.url} target="_blank" rel="nofollow sponsored noopener noreferrer" className={styles.btnPrimary}>
                              {store.externalCta.replace("{store}", product.store)}
                            </a>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
