import Link from "next/link";
import { headers } from "next/headers";

import { siteLocaleFromRequest } from "@/lib/i18n";

export default async function RootNotFound() {
  const h = await headers();
  const siteLocale = siteLocaleFromRequest(h.get("cf-ipcountry"), h.get("accept-language"));
  const isEs = siteLocale.startsWith("es");

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "system-ui, sans-serif", background: "#fff", color: "#0f1720" }}>
      <div style={{ maxWidth: 560 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "#0078d4" }}>404</div>
        <h1 style={{ fontSize: 40, lineHeight: 1.1, margin: "12px 0" }}>
          {isEs ? "Página no encontrada" : "Page not found"}
        </h1>
        <p style={{ color: "#505861", lineHeight: 1.6 }}>
          {isEs
            ? "La página que buscas no existe, fue movida o la URL es incorrecta."
            : "The page you're looking for doesn't exist, was moved, or the URL is incorrect."}
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <Link
            href={isEs ? `/home/${siteLocale}` : `/home/${siteLocale}`}
            style={{ padding: "10px 16px", background: "#0078d4", color: "#fff", textDecoration: "none", borderRadius: 8 }}
          >
            {isEs ? "Ir al inicio" : "Go home"}
          </Link>
        </div>
      </div>
    </main>
  );
}
