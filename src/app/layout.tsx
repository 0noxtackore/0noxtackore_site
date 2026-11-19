import type { Metadata } from "next";
import Script from "next/script";
import { faqs, gaMeasurementId, siteUrl } from "@/components/sites/0noxtackore/data";
import "./globals.css";

const title = "0NOXTACKORE — BUILT FOR IMPACT";
const description =
  "Compañía tecnológica independiente enfocada en la ingeniería, desarrollo y evolución de soluciones de software, y en la recomendación de productos tecnológicos.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "0NOXTACKORE",
  keywords: [
    "0NOXTACKORE",
    "desarrollo de software",
    "ingeniería open source",
    "integraciones",
    "productos tecnológicos",
    "recomendación tecnológica",
    "consultoría técnica",
  ],
  authors: [{ name: "0NOXTACKORE" }],
  creator: "0NOXTACKORE",
  publisher: "0NOXTACKORE",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "0NOXTACKORE",
    title,
    description,
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "0NOXTACKORE — BUILT FOR IMPACT. Tecnología con propósito.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "0NOXTACKORE",
  alternateName: "0noxtackore",
  slogan: "BUILT FOR IMPACT",
  url: siteUrl,
  logo: `${siteUrl}/sites/0noxtackore/logo.webp`,
  image: `${siteUrl}/opengraph-image.jpg`,
  description,
  inLanguage: "es",
  sameAs: [
    "https://www.facebook.com/people/0noxtackore/61567098773222/",
    "https://www.instagram.com/0noxtackore.dev/",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "0NOXTACKORE — BUILT FOR IMPACT",
  url: siteUrl,
  inLanguage: "es",
  publisher: { "@type": "Organization", name: "0NOXTACKORE", url: siteUrl },
};

// The questions and answers here must match the visible FAQ section exactly.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

// Escape "<" so the inline JSON can never break out of the <script> element.
const structuredData = JSON.stringify([
  organizationJsonLd,
  websiteJsonLd,
  faqJsonLd,
]).replace(/</g, "\\u003c");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaMeasurementId}', { anonymize_ip: true });`}
        </Script>
      </body>
    </html>
  );
}
