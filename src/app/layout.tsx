import type { Metadata } from "next";

import { ConsentGate } from "@/components/sites/0noxtackore/ConsentGate";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://0noxtackore.makes.fyi"),
  icons: {
    icon: [
      { url: "/favicon-light.png", type: "image/png" },
      { url: "/favicon-dark.png", type: "image/png", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" dir="ltr" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        {children}
        <ConsentGate />
      </body>
    </html>
  );
}
