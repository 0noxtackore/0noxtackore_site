import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getContent } from "@/components/sites/0noxtackore/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
      "BUILT FOR IMPACT",
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
          url: "/opengraph-image.jpg",
          width: 1200,
          height: 630,
          alt: `${content.brand.name} — BUILT FOR IMPACT. ${locale === "es" ? "Tecnología con propósito." : "Technology with purpose."}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/opengraph-image.jpg"],
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

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: content.brand.name,
    alternateName: "0noxtackore",
    slogan: content.brand.tagline,
    foundingDate: "2026",
    areaServed: { "@type": "Place", name: "Global" },
    url: content.baseUrl,
    logo: `${content.baseUrl}/sites/0noxtackore/logo.webp`,
    image: `${content.baseUrl}/opengraph-image.jpg`,
    description: content.metadata.home.description,
    sameAs: [
      "https://github.com/0noxtackore",
      "https://www.facebook.com/people/0noxtackore/61567098773222/",
      "https://www.instagram.com/0noxtackore.dev/",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: content.brand.name,
    alternateName: "0noxtackore",
    url: content.baseUrl,
    inLanguage: value,
    publisher: { "@type": "Organization", name: content.brand.name, url: content.baseUrl },
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
    websiteJsonLd,
    faqJsonLd,
  ]).replace(/</g, "\\u003c");

  return (
    <html lang={value} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
        {children}
      </body>
    </html>
  );
}
