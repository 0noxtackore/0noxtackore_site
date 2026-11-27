import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { getContent } from "@/components/sites/0noxtackore/content";
import { siteUrl } from "@/components/sites/0noxtackore/data";
import { isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0078d4",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: value } = await params;
  const locale: Locale = isLocale(value) ? value : "es";
  const content = getContent(locale);
  const meta = content.metadata.home;
  const canonical = `/${locale}`;
  const ogImagePath = content.ogImage;

  return {
    title: meta.title,
    description: meta.description,
    applicationName: content.brand.name,
    keywords: [
      content.brand.name,
      locale === "es" ? "desarrollo de software" : "software development",
      locale === "es" ? "consultoría técnica" : "technical consulting",
      locale === "es" ? "ingeniería open source" : "open-source engineering",
      locale === "es" ? "recomendación de laptops" : "laptop recommendations",
      content.brand.tagline,
    ],
    authors: [{ name: content.brand.name }],
    creator: content.brand.name,
    publisher: content.brand.name,
    alternates: {
      canonical,
      languages: {
        es: "/es",
        en: "/en",
        "x-default": "/es",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      url: canonical,
      siteName: content.brand.name,
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: `${content.brand.name} — ${content.brand.tagline}. ${locale === "es" ? "Tecnología con propósito." : "Technology with purpose."}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImagePath],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const content = getContent(value);
  const ogImagePath = content.ogImage;
  const ogImageUrl = new URL(ogImagePath, siteUrl).toString();

  const organizationId = `${siteUrl}/#organization`;
  const founderId = `${siteUrl}/#founder`;

  const founderJsonLd = {
    "@type": "Person",
    "@id": founderId,
    name: "Angello Aponte",
    jobTitle: value === "es" ? "Fundador y CEO" : "Founder & CEO",
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
    knowsAbout: [
      "Software engineering",
      "Open source software",
      "Technology integrations",
      "Technical consulting",
      "Technology product recommendations",
    ],
    url: siteUrl,
    logo: `${siteUrl}/sites/0noxtackore/logo.webp`,
    image: ogImageUrl,
    description: content.metadata.home.description,
    founder: { "@id": founderId },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: `${siteUrl}${value === "en" ? "/en/about" : "/es/acerca"}`,
        availableLanguage: ["es", "en"],
      },
    ],
    sameAs: [
      "https://github.com/0noxtackore",
      "https://www.youtube.com/@0noxtackore",
      "https://www.facebook.com/people/0noxtackore/61567098773222/",
      "https://www.instagram.com/0noxtackore.dev/",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: content.brand.name,
    alternateName: ["0noxtackore", "Onoxtackore", "0noxtackore inc", "0noxtackore corp"],
    url: siteUrl,
    inLanguage: value,
    publisher: { "@id": organizationId },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const structuredData = JSON.stringify([
    organizationJsonLd,
    founderJsonLd,
    websiteJsonLd,
    faqJsonLd,
  ]).replace(/</g, "\\u003c");

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(value)};` }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      {children}
    </>
  );
}
