import type { Metadata } from "next";

import { Guia } from "@/components/sites/0noxtackore/Guia";

const title = "Guía para elegir una laptop con buena relación calidad-precio";
const description =
  "Guía práctica para evaluar procesador, memoria RAM, almacenamiento y batería antes de comprar una laptop, con criterios claros y sin promesas vacías.";

export const metadata: Metadata = {
  title: `${title} | 0NOXTACKORE`,
  description,
  alternates: { canonical: "/guia" },
  openGraph: {
    type: "article",
    title: `${title} | 0NOXTACKORE`,
    description,
    url: "/guia",
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

export default function GuiaPage() {
  return <Guia />;
}
