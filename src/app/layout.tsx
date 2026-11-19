import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://0noxtackore.github.io/0noxtackore_site";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
