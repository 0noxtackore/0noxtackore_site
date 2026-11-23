import Link from "next/link";

import { getContent } from "./content";
import styles from "./site.module.css";
import { siteUrl } from "./data";
import { getPagePath, type Locale } from "@/lib/i18n";
import type { StoreProductRecord } from "@/lib/store/types";
import { withAffiliateTracking } from "@/lib/store/affiliate";

type Props = {
  locale: Locale;
  product: StoreProductRecord;
  similar: StoreProductRecord[];
};

function mapProduct(p: StoreProductRecord, locale: Locale) {
  return {
    id: p.id,
    name: locale === "es" ? p.nameEs : p.nameEn,
    description: locale === "es" ? p.descriptionEs : p.descriptionEn,
    category: p.category,
    store: p.store,
    priceNote: locale === "es" ? p.priceNoteEs : p.priceNoteEn,
    url: withAffiliateTracking(p.affiliateUrl, p.store),
    image: p.imageUrl,
    badge: locale === "es" ? p.badgeEs : p.badgeEn,
  };
}

export function ProductDetail({ locale, product: record, similar }: Props) {
  const content = getContent(locale);
  const store = content.pages.tienda;
  const product = mapProduct(record, locale);
  const similarProducts = similar.map((p) => mapProduct(p, locale));
  const storePath = getPagePath(locale, "tienda");
  const productUrl = `${siteUrl}${storePath}/${product.id}`;

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
            <Link href={storePath} className={styles.guideBack}>
              {store.backToStore}
            </Link>
          </div>
        </header>

        <section className={styles.productDetail}>
          <div className={styles.productDetailMedia}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className={styles.productDetailImage}
            />
          </div>
          <div className={styles.productDetailBody}>
            <p className={styles.storeCardMeta}>
              {product.category} · {product.store}
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} loading="lazy" className={styles.storeCardImage} />
                      {p.badge ? <span className={styles.storeBadge}>{p.badge}</span> : null}
                    </Link>
                    <div className={styles.storeCardBody}>
                      <p className={styles.storeCardMeta}>
                        {p.category} · {p.store}
                      </p>
                      <h3 className={styles.storeCardTitle}>{p.name}</h3>
                      <p className={styles.storeCardDesc}>{p.description}</p>
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
