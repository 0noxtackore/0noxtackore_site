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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [badgeOnly, setBadgeOnly] = useState(false);
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

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);
  const stores = useMemo(() => Array.from(new Set(products.map((p) => p.store))), [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (selectedCategories.length === 0 || selectedCategories.includes(p.category)) &&
        (selectedStores.length === 0 || selectedStores.includes(p.store)) &&
        (!badgeOnly || Boolean(p.badge)) &&
        (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.store.toLowerCase().includes(q)),
    );
  }, [products, selectedCategories, selectedStores, badgeOnly, query]);

  const activeCategoryLabel =
    selectedCategories.length === 1 ? selectedCategories[0] : store.allCategories;
  const hasActiveFilters =
    selectedCategories.length > 0 || selectedStores.length > 0 || badgeOnly || query.trim() !== "";

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedStores([]);
    setBadgeOnly(false);
    setQuery("");
  };

  const toggleCategory = (c: string) => {
    setSelectedCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };
  const toggleStore = (s: string) => {
    setSelectedStores((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const categoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("gaming") || n.includes("juego")) return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h12a3 3 0 0 1 3 3v4a2 2 0 0 1-2 2h-2l-2-2h-6l-2 2H5a2 2 0 0 1-2-2v-4a3 3 0 0 1 3-3z"/><path d="M8 11h2m-1-1v2m6 .5h.01M17 12.5h.01"/></svg>;
    if (n.includes("pc") || n.includes("component") || n.includes("comput")) return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="11" rx="2"/><path d="M8 20h8M12 15v5"/></svg>;
    if (n.includes("laptop") || n.includes("portátil") || n.includes("portatil")) return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2.5 19h19"/></svg>;
    if (n.includes("accesor")) return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-7.07-2.83 2.83M9.76 14.24l-2.83 2.83m0-10.14 2.83 2.83m4.48 4.48 2.83 2.83"/></svg>;
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7 12 3 4 7v10l8 4 8-4z"/><path d="M12 22V12m8-5-8 5-8-5"/></svg>;
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
            <div className={styles.storeCategoryRail} aria-label={store.allCategories}>
              <button type="button" onClick={() => setSelectedCategories([])} className={`${styles.storeCategoryChip} ${selectedCategories.length === 0 ? styles.storeCategoryChipActive : ""}`}>
                <span className={styles.storeCategoryIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
                </span>
                {store.allCategories}
              </button>
              {categories.map((c) => (
                <button key={c} type="button" onClick={() => toggleCategory(c)} className={`${styles.storeCategoryChip} ${selectedCategories.includes(c) ? styles.storeCategoryChipActive : ""}`}>
                  <span className={styles.storeCategoryIcon} aria-hidden="true">{categoryIcon(c)}</span>
                  {c}
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
                  <div className={styles.storeFilterGroupTitle}>{locale === "es" ? "Buscar" : "Search"}</div>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={locale === "es" ? "Nombre, categoría..." : "Name, category..."}
                    className={styles.storeSearchInput}
                    style={{ width: "100%", minWidth: 0 }}
                  />
                </div>

                <div className={styles.storeFilterGroup}>
                  <div className={styles.storeFilterGroupTitle}>{store.storeLabel}</div>
                  {stores.map((s) => (
                    <label key={s} className={styles.storeFilterOption}>
                      <input type="checkbox" checked={selectedStores.includes(s)} onChange={() => toggleStore(s)} />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>

                <div className={styles.storeFilterGroup}>
                  <div className={styles.storeFilterGroupTitle}>{locale === "es" ? "Categoría" : "Category"}</div>
                  {categories.map((c) => (
                    <label key={c} className={styles.storeFilterOption}>
                      <input type="checkbox" checked={selectedCategories.includes(c)} onChange={() => toggleCategory(c)} />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>

                <div className={styles.storeFilterGroup}>
                  <div className={styles.storeFilterGroupTitle}>{locale === "es" ? "Extras" : "Extras"}</div>
                  <label className={styles.storeFilterOption}>
                    <input type="checkbox" checked={badgeOnly} onChange={(e) => setBadgeOnly(e.target.checked)} />
                    <span>{locale === "es" ? "Solo con badge" : "Only with badge"}</span>
                  </label>
                </div>
              </aside>

              <div className={styles.storeCatalogMain}>
                <div className={styles.storeToolbar}>
                  <div>
                    <p className={styles.storeToolbarTitle}>{activeCategoryLabel} <span className={styles.storeToolbarCount}>({filtered.length})</span></p>
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
