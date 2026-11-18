import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "0NOXTACKORE — BUILT FOR IMPACT",
  description:
    "Compañía tecnológica independiente enfocada en la ingeniería, desarrollo y evolución de soluciones de software, y en la recomendación de productos tecnológicos.",
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
