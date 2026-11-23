import Link from "next/link";

export default function RootNotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "system-ui, sans-serif", background: "#fff", color: "#0f1720" }}>
      <div style={{ maxWidth: 560 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "#0078d4" }}>404</div>
        <h1 style={{ fontSize: 40, lineHeight: 1.1, margin: "12px 0" }}>Página no encontrada / Page not found</h1>
        <p style={{ color: "#505861", lineHeight: 1.6 }}>
          La página que buscas no existe o fue movida. / The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <Link href="/es" style={{ padding: "10px 16px", background: "#0078d4", color: "#fff", textDecoration: "none", borderRadius: 8 }}>
            Inicio (ES)
          </Link>
          <Link href="/en" style={{ padding: "10px 16px", border: "1px solid #d1d1d1", color: "#0f1720", textDecoration: "none", borderRadius: 8 }}>
            Home (EN)
          </Link>
        </div>
      </div>
    </main>
  );
}
