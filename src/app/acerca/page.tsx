import type { Metadata } from "next";

import { About } from "@/components/sites/0noxtackore/About";

const title = "Acerca de 0NOXTACKORE";
const description =
  "Conoce a 0NOXTACKORE: estudio tecnológico indie y arquitectura de software de alto rendimiento. Quién hay detrás, qué construimos y nuestros canales oficiales.";

export const metadata: Metadata = {
  title: `${title} | 0NOXTACKORE`,
  description,
  alternates: { canonical: "/acerca" },
  openGraph: {
    type: "profile",
    title: `${title} | 0NOXTACKORE`,
    description,
    url: "/acerca",
    siteName: "0NOXTACKORE",
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
    title: `${title} | 0NOXTACKORE`,
    description,
    images: ["/opengraph-image.jpg"],
  },
};

export default function AcercaPage() {
  return <About />;
}
