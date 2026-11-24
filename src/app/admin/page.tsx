"use client";

import { useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { auth, db, firebaseConfigured } from "@/lib/firebase/client";
import type { StoreProductInput, StoreProductRecord, StoreName } from "@/lib/store/types";

type FormState = {
  id?: string;
  active: boolean;
  store: StoreName;
  category: string;
  affiliateUrl: string;
  imageUrl: string;
  imageSource: "affiliate" | "custom";
  priceNoteEs: string;
  priceNoteEn: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  badgeEs: string;
  badgeEn: string;
};

type View = "list" | "form";
type StatusKind = "info" | "success" | "error";

const emptyForm = (): FormState => ({
  active: true,
  store: "Amazon",
  category: "",
  affiliateUrl: "",
  imageUrl: "",
  imageSource: "affiliate",
  priceNoteEs: "Precio en Amazon",
  priceNoteEn: "Price on Amazon",
  nameEs: "",
  nameEn: "",
  descriptionEs: "",
  descriptionEn: "",
  badgeEs: "",
  badgeEn: "",
});

function toRecord(id: string, data: Record<string, unknown>): StoreProductRecord {
  const s = (k: string) => (typeof data[k] === "string" ? (data[k] as string) : "");
  const b = (k: string) => data[k] === true;
  const store = s("store") === "AliExpress" ? "AliExpress" : "Amazon";
  return {
    id,
    active: b("active"),
    store,
    category: s("category"),
    affiliateUrl: s("affiliateUrl"),
    imageUrl: s("imageUrl"),
    imageSource: s("imageSource") === "custom" ? "custom" : "affiliate",
    priceNoteEs: s("priceNoteEs"),
    priceNoteEn: s("priceNoteEn"),
    nameEs: s("nameEs"),
    nameEn: s("nameEn"),
    descriptionEs: s("descriptionEs"),
    descriptionEn: s("descriptionEn"),
    badgeEs: s("badgeEs") || undefined,
    badgeEn: s("badgeEn") || undefined,
    createdAt: s("createdAt") || undefined,
    updatedAt: s("updatedAt") || undefined,
  };
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 10,
  fontSize: 14,
  background: "#fff",
  color: "#0f1720",
  outline: "none",
  boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  color: "#374151",
};
const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 24,
  marginBottom: 20,
  boxShadow: "0 1px 2px rgba(15,23,32,0.04)",
};
const btnBase: React.CSSProperties = {
  padding: "9px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#0f1720",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};
const btnPrimary: React.CSSProperties = {
  ...btnBase,
  background: "#0f1720",
  borderColor: "#0f1720",
  color: "#fff",
};
const btnBlue: React.CSSProperties = {
  ...btnBase,
  background: "#0078d4",
  borderColor: "#0078d4",
  color: "#fff",
};
const btnDanger: React.CSSProperties = {
  ...btnBase,
  color: "#b91c1c",
  borderColor: "#fecaca",
  background: "#fff",
};
const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#6b7280",
  margin: "0 0 12px",
};

function StatCard({ label, value, accent }: { label: string; value: number | string; accent?: string }) {
  return (
    <div style={{ flex: "1 1 140px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "16px 18px", boxShadow: "0 1px 2px rgba(15,23,32,0.04)" }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: accent ?? "#0f1720", lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [products, setProducts] = useState<StoreProductRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [pasteUrl, setPasteUrl] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm());
  const [status, setStatus] = useState("");
  const [statusKind, setStatusKind] = useState<StatusKind>("info");
  const [view, setView] = useState<View>("list");
  const [search, setSearch] = useState("");
  const [filterStore, setFilterStore] = useState<"all" | StoreName>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "hidden">("all");

  const allowedEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "").trim().toLowerCase();
  const isAllowed = !!user && (!allowedEmail || user.email?.toLowerCase() === allowedEmail);

  function flash(msg: string, kind: StatusKind = "info") {
    setStatus(msg);
    setStatusKind(kind);
  }

  async function loadProducts() {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("updatedAt", "desc"));
      const snap = await getDocs(q);
      setProducts(snap.docs.map((d) => toRecord(d.id, d.data() as Record<string, unknown>)));
    } catch (e) {
      flash(`Error cargando productos: ${String(e)}`, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isAllowed) void loadProducts();
  }, [isAllowed]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setAuthError(String(err));
    }
  }

  async function handleExtract() {
    if (!pasteUrl.trim()) return;
    setExtracting(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: pasteUrl.trim() }),
      });
      const json = await res.json();
      const d = json.data as
        | {
            name: string;
            description: string;
            imageUrl: string;
            store: string;
            priceNote: string;
            affiliateUrl: string;
            source?: string;
            warning?: string;
          }
        | undefined;
      if (!res.ok || !d) throw new Error(json.error || "extract failed");

      const store: StoreName = d.store === "AliExpress" ? "AliExpress" : "Amazon";
      setForm((f) => ({
        ...f,
        store,
        affiliateUrl: d.affiliateUrl || f.affiliateUrl || pasteUrl.trim(),
        imageUrl: d.imageUrl || f.imageUrl,
        imageSource: d.imageUrl ? "affiliate" : f.imageSource,
        nameEs: f.nameEs || d.name,
        nameEn: f.nameEn || d.name,
        descriptionEs: f.descriptionEs || d.description,
        descriptionEn: f.descriptionEn || d.description,
        priceNoteEs: f.priceNoteEs || (store === "Amazon" ? "Precio en Amazon" : "Precio en AliExpress"),
        priceNoteEn: f.priceNoteEn || (store === "Amazon" ? "Price on Amazon" : "Price on AliExpress"),
      }));
      if (!json.ok) {
        flash(d.warning || "Extracción incompleta. Rellena el resto del formulario a mano.", "error");
      } else if (d.warning) {
        flash(`${d.warning} (fuente: ${d.source === "wayback" ? "archivo web" : d.source === "scraperapi" ? "ScraperAPI" : "directa"})`, "info");
      } else {
        flash("Datos extraídos. Revisa y completa ES/EN antes de guardar.", "success");
      }
    } catch (err) {
      flash(`No se pudo extraer: ${String(err)}. Puedes llenar el formulario manualmente.`, "error");
      setForm((f) => ({ ...f, affiliateUrl: f.affiliateUrl || pasteUrl.trim() }));
    } finally {
      setExtracting(false);
    }
  }

  async function handleImageUpload(file: File) {
    if (!file) return;
    flash("Subiendo imagen...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setForm((f) => ({ ...f, imageUrl: json.url as string, imageSource: "custom" }));
      flash("Imagen subida a Supabase Storage.", "success");
    } catch (err) {
      flash(`Error subiendo imagen: ${String(err)}`, "error");
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    const payload: StoreProductInput = {
      active: form.active,
      store: form.store,
      category: form.category.trim(),
      affiliateUrl: form.affiliateUrl.trim(),
      imageUrl: form.imageUrl.trim(),
      imageSource: form.imageSource,
      priceNoteEs: form.priceNoteEs.trim(),
      priceNoteEn: form.priceNoteEn.trim(),
      nameEs: form.nameEs.trim(),
      nameEn: form.nameEn.trim(),
      descriptionEs: form.descriptionEs.trim(),
      descriptionEn: form.descriptionEn.trim(),
      badgeEs: form.badgeEs.trim() || undefined,
      badgeEn: form.badgeEn.trim() || undefined,
    };
    try {
      if (form.id) {
        await updateDoc(doc(db, "products", form.id), { ...payload, updatedAt: new Date().toISOString() });
        flash("Producto actualizado.", "success");
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        flash("Producto creado.", "success");
      }
      setForm(emptyForm());
      setPasteUrl("");
      setView("list");
      await loadProducts();
    } catch (err) {
      flash(`Error guardando: ${String(err)}`, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      flash("Producto eliminado.", "success");
      await loadProducts();
    } catch (err) {
      flash(`Error eliminando: ${String(err)}`, "error");
    }
  }

  async function toggleActive(p: StoreProductRecord) {
    try {
      await updateDoc(doc(db, "products", p.id), { active: !p.active, updatedAt: new Date().toISOString() });
      await loadProducts();
    } catch (err) {
      flash(`Error: ${String(err)}`, "error");
    }
  }

  function editProduct(p: StoreProductRecord) {
    setForm({
      id: p.id,
      active: p.active,
      store: p.store,
      category: p.category,
      affiliateUrl: p.affiliateUrl,
      imageUrl: p.imageUrl,
      imageSource: p.imageSource,
      priceNoteEs: p.priceNoteEs,
      priceNoteEn: p.priceNoteEn,
      nameEs: p.nameEs,
      nameEn: p.nameEn,
      descriptionEs: p.descriptionEs,
      descriptionEn: p.descriptionEn,
      badgeEs: p.badgeEs ?? "",
      badgeEn: p.badgeEn ?? "",
    });
    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function newProduct() {
    setForm(emptyForm());
    setPasteUrl("");
    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const stats = useMemo(() => {
    const active = products.filter((p) => p.active).length;
    return {
      total: products.length,
      active,
      hidden: products.length - active,
      amazon: products.filter((p) => p.store === "Amazon").length,
      aliexpress: products.filter((p) => p.store === "AliExpress").length,
    };
  }, [products]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      if (filterStore !== "all" && p.store !== filterStore) return false;
      if (filterStatus === "active" && !p.active) return false;
      if (filterStatus === "hidden" && p.active) return false;
      if (!term) return true;
      return [p.nameEs, p.nameEn, p.category, p.affiliateUrl]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [products, search, filterStore, filterStatus]);

  if (!firebaseConfigured) {
    return (
      <div style={{ maxWidth: 640, margin: "60px auto", padding: 24, background: "#fff", borderRadius: 12 }}>
        <h1 style={{ marginTop: 0 }}>Firebase no configurado</h1>
        <p>Faltan las variables <code>NEXT_PUBLIC_FIREBASE_*</code> en el entorno. Agrégalas en <code>.env.local</code> y en Vercel (Environment Variables) y redeploy.</p>
      </div>
    );
  }

  if (!authReady) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f5f7fa", fontFamily: "system-ui, sans-serif", color: "#6b7280" }}>
        Cargando...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "radial-gradient(circle at top, #eef4fb, #f5f7fa)", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 440, background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 12px 32px rgba(15,23,32,0.08)", padding: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#0078d4", textTransform: "uppercase", marginBottom: 8 }}>0NOXTACKORE</div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "0 0 8px", color: "#0f1720" }}>Admin tienda</h1>
          <p style={{ fontSize: 14, color: "#5f6b76", margin: "0 0 24px", lineHeight: 1.5 }}>Acceso solo para administrador.</p>
          <form onSubmit={handleLogin}>
            <label style={{ ...labelStyle, color: "#0f1720" }}>Email</label>
            <input style={{ ...inputStyle, marginBottom: 14 }} value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
            <label style={{ ...labelStyle, color: "#0f1720" }}>Contraseña</label>
            <input style={{ ...inputStyle, marginBottom: 18 }} value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required />
            {authError && <div style={{ color: "#b91c1c", fontSize: 13, marginBottom: 14, background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 12px", borderRadius: 8, whiteSpace: "pre-wrap" }}>{authError}</div>}
            <button style={{ width: "100%", padding: "12px 16px", background: "#0f1720", color: "#fff", border: 0, borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 600 }} type="submit">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div style={{ maxWidth: 520, margin: "60px auto", padding: 24, background: "#fff", borderRadius: 12 }}>
        <h1>Acceso denegado</h1>
        <p>Este correo no está autorizado.</p>
        <button onClick={() => signOut(auth)}>Salir</button>
      </div>
    );
  }

  const statusColors: Record<StatusKind, React.CSSProperties> = {
    info: { background: "#f0f7ff", borderColor: "#bfdbfe", color: "#1e40af" },
    success: { background: "#f0fdf4", borderColor: "#bbf7d0", color: "#166534" },
    error: { background: "#fef2f2", borderColor: "#fecaca", color: "#991b1b" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 20px 64px" }}>
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sites/0noxtackore/logo.webp" alt="0NOXTACKORE" width={150} height={47} style={{ height: 40, width: "auto" }} />
            <div style={{ borderLeft: "1px solid #d1d5db", paddingLeft: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0f1720", lineHeight: 1.2 }}>Panel de tienda</div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>{user.email}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={btnBase} onClick={() => void loadProducts()}>Recargar</button>
            <a
              href="/es/tienda"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...btnBase, textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            >
              Ver tienda ↗
            </a>
            <button style={btnBase} onClick={() => signOut(auth)}>Salir</button>
          </div>
        </header>

        {/* Status */}
        {status && (
          <div style={{ ...cardStyle, ...statusColors[statusKind], padding: "12px 16px", fontSize: 14, marginBottom: 20 }}>
            {status}
          </div>
        )}

        {view === "list" ? (
          <>
            {/* Stats */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              <StatCard label="Total productos" value={loading ? "…" : stats.total} />
              <StatCard label="Activos en tienda" value={loading ? "…" : stats.active} accent="#16a34a" />
              <StatCard label="Ocultos" value={loading ? "…" : stats.hidden} accent="#9ca3af" />
              <StatCard label="Amazon" value={loading ? "…" : stats.amazon} accent="#ff9900" />
              <StatCard label="AliExpress" value={loading ? "…" : stats.aliexpress} accent="#e62e04" />
            </div>

            {/* Toolbar */}
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 20 }}>Productos</h2>
                <button style={btnBlue} onClick={newProduct}>+ Nuevo producto</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(200px, 1fr) 160px 160px", gap: 10 }}>
                <input
                  style={inputStyle}
                  placeholder="Buscar por nombre, categoría o URL..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select style={inputStyle} value={filterStore} onChange={(e) => setFilterStore(e.target.value as typeof filterStore)}>
                  <option value="all">Todas las tiendas</option>
                  <option value="Amazon">Amazon</option>
                  <option value="AliExpress">AliExpress</option>
                </select>
                <select style={inputStyle} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}>
                  <option value="all">Todos los estados</option>
                  <option value="active">Solo activos</option>
                  <option value="hidden">Solo ocultos</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div style={cardStyle}>
              {loading ? (
                <p style={{ color: "#6b7280", margin: 0 }}>Cargando productos...</p>
              ) : products.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 16px" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🛍️</div>
                  <h3 style={{ margin: "0 0 8px", fontSize: 18 }}>Aún no hay productos</h3>
                  <p style={{ color: "#6b7280", margin: "0 0 20px", fontSize: 14 }}>
                    Pega un link de Amazon o AliExpress y crea tu primer producto.
                  </p>
                  <button style={btnBlue} onClick={newProduct}>Crear el primero</button>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 16px" }}>
                  <p style={{ color: "#6b7280", margin: 0 }}>Ningún producto coincide con los filtros.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {filtered.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 14,
                        padding: 14,
                        display: "grid",
                        gridTemplateColumns: "72px 1fr auto",
                        gap: 14,
                        alignItems: "center",
                        background: p.active ? "#fff" : "#fafafa",
                      }}
                    >
                      <div style={{ width: 72, height: 72, background: "#f3f4f6", borderRadius: 10, overflow: "hidden", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imageUrl} alt={p.nameEs || p.nameEn || "Producto"} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        ) : (
                          <span style={{ fontSize: 22, opacity: 0.4 }}>📦</span>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 15, color: "#0f1720" }}>{p.nameEs || p.nameEn || "(sin nombre)"}</span>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 999,
                              background: p.store === "Amazon" ? "#fff7ed" : "#fef2f2",
                              color: p.store === "Amazon" ? "#c2410c" : "#b91c1c",
                              border: `1px solid ${p.store === "Amazon" ? "#fed7aa" : "#fecaca"}`,
                            }}
                          >
                            {p.store}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 999,
                              background: p.active ? "#f0fdf4" : "#f3f4f6",
                              color: p.active ? "#166534" : "#6b7280",
                              border: `1px solid ${p.active ? "#bbf7d0" : "#e5e7eb"}`,
                            }}
                          >
                            {p.active ? "Activo" : "Oculto"}
                          </span>
                          {p.category && (
                            <span style={{ fontSize: 12, color: "#6b7280" }}>· {p.category}</span>
                          )}
                        </div>
                        {p.nameEn && p.nameEs && (
                          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 2 }}>{p.nameEn}</div>
                        )}
                        <div style={{ fontSize: 12, color: "#9ca3af", wordBreak: "break-all" }}>{p.affiliateUrl}</div>
                        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                          Actualizado: {formatDate(p.updatedAt)} · Creado: {formatDate(p.createdAt)}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        <button style={btnBase} onClick={() => editProduct(p)}>Editar</button>
                        <button style={btnBase} onClick={() => void toggleActive(p)}>
                          {p.active ? "Ocultar" : "Activar"}
                        </button>
                        <button style={btnDanger} onClick={() => void handleDelete(p.id)}>Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* ============ FORM VIEW ============ */
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>{form.id ? "Editar producto" : "Nuevo producto"}</h2>
              <button style={btnBase} onClick={() => { setView("list"); setForm(emptyForm()); setPasteUrl(""); }}>
                ← Volver a productos
              </button>
            </div>

            {/* Paso 1: link */}
            <div style={{ marginBottom: 24, padding: 16, background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 12 }}>
              <div style={sectionTitle}>1 · Pega el link del producto</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input
                  style={{ ...inputStyle, flex: "1 1 260px" }}
                  placeholder="https://www.amazon.com/dp/... o enlace de AliExpress"
                  value={pasteUrl}
                  onChange={(e) => setPasteUrl(e.target.value)}
                />
                <button style={btnBlue} onClick={() => void handleExtract()} disabled={extracting}>
                  {extracting ? "Extrayendo..." : "Extraer datos"}
                </button>
              </div>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "8px 0 0" }}>
                La extracción es best-effort: rellena lo posible y revisa el resto a mano.
              </p>
            </div>

            <form onSubmit={handleSave}>
              {/* Paso 2: enlace e imagen */}
              <div style={{ marginBottom: 24 }}>
                <div style={sectionTitle}>2 · Enlace e imagen</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Tienda</label>
                    <select style={inputStyle} value={form.store} onChange={(e) => setForm({ ...form, store: e.target.value as StoreName })}>
                      <option value="Amazon">Amazon</option>
                      <option value="AliExpress">AliExpress</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Categoría</label>
                    <input style={inputStyle} placeholder="Ej. Gadgets, Oficina..." value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>URL afiliada</label>
                    <input style={inputStyle} value={form.affiliateUrl} onChange={(e) => setForm({ ...form, affiliateUrl: e.target.value })} required />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>URL imagen (afiliada o propia)</label>
                    <input style={inputStyle} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Origen imagen</label>
                    <select style={inputStyle} value={form.imageSource} onChange={(e) => setForm({ ...form, imageSource: e.target.value as "affiliate" | "custom" })}>
                      <option value="affiliate">Afiliada / default</option>
                      <option value="custom">Propia</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Subir imagen propia (Supabase)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleImageUpload(f); }}
                      style={{ fontSize: 13, width: "100%" }}
                    />
                  </div>
                </div>
                {form.imageUrl && (
                  <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 64, height: 64, border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", background: "#f9fafb", display: "grid", placeItems: "center" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.imageUrl} alt="Vista previa" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>Vista previa</span>
                  </div>
                )}
              </div>

              {/* Paso 3: contenido ES */}
              <div style={{ marginBottom: 24 }}>
                <div style={sectionTitle}>3 · Contenido en español</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Nombre ES *</label>
                    <input style={inputStyle} value={form.nameEs} onChange={(e) => setForm({ ...form, nameEs: e.target.value })} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Badge ES (opcional)</label>
                    <input style={inputStyle} placeholder="Ej. Top ventas" value={form.badgeEs} onChange={(e) => setForm({ ...form, badgeEs: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Precio nota ES</label>
                    <input style={inputStyle} value={form.priceNoteEs} onChange={(e) => setForm({ ...form, priceNoteEs: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Descripción ES</label>
                    <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={form.descriptionEs} onChange={(e) => setForm({ ...form, descriptionEs: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Paso 4: contenido EN */}
              <div style={{ marginBottom: 24 }}>
                <div style={sectionTitle}>4 · Contenido en inglés</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Nombre EN *</label>
                    <input style={inputStyle} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Badge EN (opcional)</label>
                    <input style={inputStyle} placeholder="E.g. Best seller" value={form.badgeEn} onChange={(e) => setForm({ ...form, badgeEn: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Precio nota EN</label>
                    <input style={inputStyle} value={form.priceNoteEn} onChange={(e) => setForm({ ...form, priceNoteEn: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Descripción EN</label>
                    <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Paso 5: publicación */}
              <div style={{ padding: 16, background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 12 }}>
                <div style={sectionTitle}>5 · Publicación</div>
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "#0f1720", marginBottom: 14 }}>
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                  Visible en la tienda
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button disabled={saving} type="submit" style={{ ...btnPrimary, padding: "11px 20px" }}>
                    {saving ? "Guardando..." : form.id ? "Guardar cambios" : "Crear producto"}
                  </button>
                  {form.id && (
                    <button type="button" style={btnBase} onClick={() => { setForm(emptyForm()); setPasteUrl(""); setView("list"); }}>
                      Cancelar edición
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}