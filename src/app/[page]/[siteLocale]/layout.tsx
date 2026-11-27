import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { getContent } from "@/components/sites/0noxtackore/content";
import { siteUrl } from "@/components/sites/0noxtackore/data";
import { INDEXED_LOCALES, isIndexedLocale, isSiteLocale, languageOf, sitePath, type SiteLocale } from "@/lib/i18n";

export const viewport: Viewport = { themeColor: "#0078d4" };

export async function generateMetadata({ params }: { params: Promise<{ siteLocale: string }> }): Promise<Metadata> {
  const { siteLocale: value } = await params;
  if (!isSiteLocale(value)) return {};
  const locale = languageOf(value);
  const content = getContent(locale, value);
  const meta = content.metadata.home;
  const canonical = sitePath("home", value);
  return {
    title: meta.title,
    description: meta.description,
    applicationName: content.brand.name,
    keywords: [content.brand.name, "technology recommendations", "open source", content.brand.tagline],
    authors: [{ name: content.brand.name }],
    creator: content.brand.name,
    publisher: content.brand.name,
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(INDEXED_LOCALES.map((loc) => [loc, sitePath("home", loc)])),
        "x-default": sitePath("home", "es-ve"),
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_VE" : "en_US",
      url: canonical,
      siteName: content.brand.name,
      title: meta.title,
      description: meta.description,
      images: [{ url: content.ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: [content.ogImage] },
    robots: { index: isIndexedLocale(value), follow: true },
  };
}

export default async function SiteLocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ siteLocale: string }> }>) {
  const { siteLocale: value } = await params;
  if (!isSiteLocale(value)) notFound();
  const siteLocale: SiteLocale = value;
  const locale = languageOf(siteLocale);
  const content = getContent(locale, siteLocale);
  const ogImageUrl = new URL(content.ogImage, siteUrl).toString();
  const organizationId = `${siteUrl}/#organization`;
  const founderId = `${siteUrl}/#founder`;

  const founderJsonLd = {
    "@type": "Person",
    "@id": founderId,
    name: "Angello Aponte",
    jobTitle: locale === "es" ? "Fundador y CEO" : "Founder & CEO",
    worksFor: { "@id": organizationId },
  };
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: content.brand.name,
    alternateName: ["0noxtackore", "Onoxtackore", "0noxtackore inc", "0noxtackore corp"],
    slogan: content.brand.tagline,
    foundingDate: "2023",
    areaServed: { "@type": "Place", name: "Global" },
    knowsAbout: ["Software engineering", "Open source software", "Technology integrations", "Technical consulting", "Technology product recommendations"],
    url: siteUrl,
    logo: `${siteUrl}/sites/0noxtackore/logo.webp`,
    image: ogImageUrl,
    description: content.metadata.home.description,
    founder: { "@id": founderId },
    contactPoint: [{ "@type": "ContactPoint", contactType: "customer support", url: `${siteUrl}${sitePath("about", siteLocale)}`, availableLanguage: ["es", "en"] }],
    sameAs: ["https://github.com/0noxtackore", "https://www.youtube.com/@0noxtackore", "https://www.facebook.com/people/0noxtackore/61567098773222/", "https://www.instagram.com/0noxtackore.dev/"],
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: content.brand.name,
    alternateName: ["0noxtackore", "Onoxtackore", "0noxtackore inc", "0noxtackore corp"],
    url: siteUrl,
    inLanguage: siteLocale,
    publisher: { "@id": organizationId },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
  const structuredData = JSON.stringify([organizationJsonLd, founderJsonLd, websiteJsonLd, faqJsonLd]).replace(/</g, "\\u003c");

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(siteLocale)};` }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      {children}
    </>
  );
}
