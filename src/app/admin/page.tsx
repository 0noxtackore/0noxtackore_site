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
  const rawStore = s("store");
  const store: StoreName = rawStore === "AliExpress" || rawStore === "DHgate" || rawStore === "RedMagic" ? rawStore : "Amazon";
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
  padding: "11px 13px",
  border: "1px solid #d4d4d4",
  borderRadius: 12,
  fontSize: 14,
  background: "#fff",
  color: "#0a0a0a",
  outline: "none",
  boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  marginBottom: 6,
  color: "#404040",
  letterSpacing: "0.01em",
};
const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 18,
  padding: 24,
  marginBottom: 20,
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};
const btnBase: React.CSSProperties = {
  padding: "9px 14px",
  borderRadius: 10,
  border: "1px solid #d4d4d4",
  background: "#fff",
  color: "#171717",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};
const btnPrimary: React.CSSProperties = {
  ...btnBase,
  background: "#0a0a0a",
  borderColor: "#0a0a0a",
  color: "#fff",
};
const btnBlue: React.CSSProperties = {
  ...btnBase,
  background: "#171717",
  borderColor: "#171717",
  color: "#fff",
};
const btnDanger: React.CSSProperties = {
  ...btnBase,
  color: "#171717",
  borderColor: "#d4d4d4",
  background: "#fff",
};
const sectionTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#737373",
  margin: "0 0 12px",
};

const XP_KEY = "0noxtackore_admin_xp";
const XP_PER_PRODUCT = 25;
const TROPHIES = [
  { min: 1, name: "Primer lanzamiento", icon: "🚀" },
  { min: 5, name: "Catálogo en marcha", icon: "⚡" },
  { min: 10, name: "Curador tech", icon: "🧠" },
  { min: 25, name: "Arquitecto de tienda", icon: "🏗️" },
  { min: 50, name: "Maestro del catálogo", icon: "🏆" },
  { min: 100, name: "Leyenda 0NOXTACKORE", icon: "👑" },
];

function getLevel(xp: number) {
  return Math.floor(xp / 100) + 1;
}

function getUnlockedTrophies(productsAdded: number) {
  return TROPHIES.filter((t) => productsAdded >= t.min);
}

function getNextTrophy(productsAdded: number) {
  return TROPHIES.find((t) => productsAdded < t.min) ?? null;
}

function StatCard({ label, value, accent }: { label: string; value: number | string; accent?: string }) {
  return (
    <div style={{ flex: "1 1 140px", background: "#fff", border: "1px solid #e5e5e5", borderRadius: 16, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent ?? "#0a0a0a", lineHeight: 1.1, letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#737373", marginTop: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
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
  const [xp, setXp] = useState(0);
  const [rewardMsg, setRewardMsg] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [translating, setTranslating] = useState<Set<string>>(new Set());

  const allowedEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "").trim().toLowerCase();
  const isAllowed = !!user && (!allowedEmail || user.email?.toLowerCase() === allowedEmail);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(XP_KEY);
    const n = raw ? Number(raw) : 0;
    if (Number.isFinite(n) && n >= 0) setXp(n);
  }, []);

  function awardXp() {
    setXp((prev) => {
      const next = prev + XP_PER_PRODUCT;
      if (typeof window !== "undefined") window.localStorage.setItem(XP_KEY, String(next));
      const added = Math.floor(next / XP_PER_PRODUCT);
      const unlocked = TROPHIES.find((t) => t.min === added);
      setRewardMsg(unlocked ? `+${XP_PER_PRODUCT} XP · Trofeo desbloqueado: ${unlocked.icon} ${unlocked.name}` : `+${XP_PER_PRODUCT} XP por nuevo producto`);
      window.setTimeout(() => setRewardMsg(""), 4000);
      return next;
    });
  }

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

  async function loadCategories() {
    try {
      const snap = await getDocs(query(collection(db, "categories"), orderBy("name", "asc")));
      setCategories(snap.docs.map((d) => ({ id: d.id, name: String((d.data() as { name?: string }).name ?? "") })).filter((c) => c.name));
    } catch (e) {
      // If categories collection doesn't exist yet, keep empty - not fatal
      console.error("Error cargando categorías", e);
    }
  }

  async function addCategory() {
    const name = newCategory.trim();
    if (!name) return;
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      flash("Esa categoría ya existe.", "info");
      return;
    }
    try {
      await addDoc(collection(db, "categories"), { name, createdAt: new Date().toISOString() });
      setNewCategory("");
      await loadCategories();
      flash("Categoría agregada.", "success");
    } catch (e) {
      flash(`Error creando categoría: ${String(e)}`, "error");
    }
  }

  async function removeCategory(id: string) {
    try {
      await deleteDoc(doc(db, "categories", id));
      await loadCategories();
    } catch (e) {
      flash(`Error eliminando categoría: ${String(e)}`, "error");
    }
  }

  async function translateField(field: "name" | "description" | "badge" | "priceNote", from: "es" | "en", to: "es" | "en") {
    const srcKey = `${field}${from === "es" ? "Es" : "En"}` as keyof FormState;
    const dstKey = `${field}${to === "es" ? "Es" : "En"}` as keyof FormState;
    const text = String(form[srcKey] ?? "").trim();
    if (!text) return;
    const key = `${field}-${from}-${to}`;
    setTranslating((prev) => new Set(prev).add(key));
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from, to }),
      });
      const json = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || !json.text) throw new Error(json.error || "Traducción falló");
      setForm((prev) => ({ ...prev, [dstKey]: json.text }));
    } catch (e) {
      flash(`Error traduciendo: ${String(e)}`, "error");
    } finally {
      setTranslating((prev) => { const next = new Set(prev); next.delete(key); return next; });
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
    if (isAllowed) {
      void loadProducts();
      void loadCategories();
    }
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

      const store: StoreName = d.store === "AliExpress" || d.store === "DHgate" || d.store === "RedMagic" ? d.store : "Amazon";
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
        priceNoteEs: f.priceNoteEs || (store === "Amazon" ? "Precio en Amazon" : store === "AliExpress" ? "Precio en AliExpress" : store === "DHgate" ? "Precio en DHgate" : "Precio en RedMagic"),
        priceNoteEn: f.priceNoteEn || (store === "Amazon" ? "Price on Amazon" : store === "AliExpress" ? "Price on AliExpress" : store === "DHgate" ? "Price on DHgate" : "Price on RedMagic"),
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
        awardXp();
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
      dhgate: products.filter((p) => p.store === "DHgate").length,
      redmagic: products.filter((p) => p.store === "RedMagic").length,
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
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0a0a0a", fontFamily: "system-ui, sans-serif", color: "#a3a3a3" }}>
        Cargando...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#0a0a0a", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 440, background: "#fff", borderRadius: 20, border: "1px solid #e5e5e5", boxShadow: "0 24px 64px rgba(0,0,0,0.35)", padding: 36 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sites/0noxtackore/logo.webp" alt="0NOXTACKORE" width={180} height={56} style={{ height: 44, width: "auto", display: "block", marginBottom: 24 }} />
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#737373", textTransform: "uppercase", marginBottom: 8 }}>Panel de administración</div>
          <h1 style={{ fontSize: 30, lineHeight: 1.15, margin: "0 0 8px", color: "#0a0a0a", fontWeight: 700 }}>Admin tienda</h1>
          <p style={{ fontSize: 14, color: "#525252", margin: "0 0 28px", lineHeight: 1.5 }}>Acceso solo para administrador.</p>
          <form onSubmit={handleLogin}>
            <label style={{ ...labelStyle, color: "#171717" }}>Email</label>
            <input style={{ ...inputStyle, marginBottom: 14, borderColor: "#d4d4d4", color: "#0a0a0a" }} value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
            <label style={{ ...labelStyle, color: "#171717" }}>Contraseña</label>
            <input style={{ ...inputStyle, marginBottom: 18, borderColor: "#d4d4d4", color: "#0a0a0a" }} value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required />
            {authError && <div style={{ color: "#991b1b", fontSize: 13, marginBottom: 14, background: "#fafafa", border: "1px solid #e5e5e5", padding: "10px 12px", borderRadius: 8, whiteSpace: "pre-wrap" }}>{authError}</div>}
            <button style={{ width: "100%", padding: "13px 16px", background: "#0a0a0a", color: "#fff", border: 0, borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 600, letterSpacing: "0.01em" }} type="submit">Entrar</button>
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
    info: { background: "#fafafa", borderColor: "#e5e5e5", color: "#171717" },
    success: { background: "#fafafa", borderColor: "#d4d4d4", color: "#0a0a0a" },
    error: { background: "#171717", borderColor: "#171717", color: "#fff" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "system-ui, sans-serif", color: "#0a0a0a" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 20px 64px" }}>
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 28, padding: "20px 24px", background: "#fff", border: "1px solid #e5e5e5", borderRadius: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sites/0noxtackore/logo.webp" alt="0NOXTACKORE" width={150} height={47} style={{ height: 38, width: "auto" }} />
            <div style={{ borderLeft: "1px solid #e5e5e5", paddingLeft: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#0a0a0a", lineHeight: 1.2, letterSpacing: "-0.01em" }}>Panel de tienda</div>
              <div style={{ fontSize: 12, color: "#737373", marginTop: 2 }}>{user.email}</div>
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

        {/* Gamification */}
        {(() => {
          const productsAdded = Math.floor(xp / XP_PER_PRODUCT);
          const level = getLevel(xp);
          const unlocked = getUnlockedTrophies(productsAdded);
          const nextTrophy = getNextTrophy(productsAdded);
          const prevMin = unlocked.length ? unlocked[unlocked.length - 1].min : 0;
          const progress = nextTrophy ? Math.min(100, ((productsAdded - prevMin) / (nextTrophy.min - prevMin)) * 100) : 100;
          return (
            <div style={{ ...cardStyle, marginBottom: 20, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#737373", marginBottom: 4 }}>Progreso del panel</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.02em" }}>Nivel {level} · {xp} XP</div>
                </div>
                <div style={{ fontSize: 13, color: "#525252" }}>{productsAdded} producto{productsAdded === 1 ? "" : "s"} cargado{productsAdded === 1 ? "" : "s"}</div>
              </div>
              <div style={{ height: 8, background: "#e5e5e5", borderRadius: 999, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "#0a0a0a", transition: "width .3s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", fontSize: 12, color: "#525252", marginBottom: 12 }}>
                <span>{nextTrophy ? `Siguiente trofeo: ${nextTrophy.icon} ${nextTrophy.name} (${productsAdded}/${nextTrophy.min})` : "Todos los trofeos desbloqueados"}</span>
                <span>+{XP_PER_PRODUCT} XP por producto nuevo</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TROPHIES.map((t) => {
                  const on = productsAdded >= t.min;
                  return (
                    <div key={t.name} title={t.name} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid " + (on ? "#0a0a0a" : "#e5e5e5"), background: on ? "#0a0a0a" : "#fafafa", color: on ? "#fff" : "#737373", fontSize: 12, fontWeight: 600 }}>
                      {t.icon} {t.name}
                    </div>
                  );
                })}
              </div>
              {rewardMsg && <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "#0a0a0a", color: "#fff", fontSize: 13, fontWeight: 600 }}>{rewardMsg}</div>}
            </div>
          );
        })()}

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
              <StatCard label="DHgate" value={loading ? "…" : stats.dhgate} accent="#f5a623" />
              <StatCard label="RedMagic" value={loading ? "…" : stats.redmagic} accent="#e60012" />
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
                  <option value="DHgate">DHgate</option>
                  <option value="RedMagic">RedMagic</option>
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
                    Pega un link de Amazon, AliExpress, DHgate o RedMagic y crea tu primer producto.
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
                              background: p.store === "Amazon" ? "#fff7ed" : p.store === "AliExpress" ? "#fef2f2" : p.store === "DHgate" ? "#fffaf0" : "#fef2f2",
                              color: p.store === "Amazon" ? "#c2410c" : p.store === "AliExpress" ? "#b91c1c" : p.store === "DHgate" ? "#b45309" : "#be123c",
                              border: `1px solid ${p.store === "Amazon" ? "#fed7aa" : p.store === "AliExpress" ? "#fecaca" : p.store === "DHgate" ? "#fde68a" : "#fecdd3"}`,
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
            <div style={{ marginBottom: 24, padding: 18, background: "#fafafa", border: "1px solid #e5e5e5", borderRadius: 14 }}>
              <div style={sectionTitle}>1 · Pega el link del producto</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                <a href="https://www.amazon.com/" target="_blank" rel="noopener noreferrer" style={{ ...btnBase, textDecoration: "none" }}>Abrir Amazon</a>
                <a href="https://www.aliexpress.com/" target="_blank" rel="noopener noreferrer" style={{ ...btnBase, textDecoration: "none" }}>Abrir AliExpress</a>
                <a href="https://www.dhgate.com/" target="_blank" rel="noopener noreferrer" style={{ ...btnBase, textDecoration: "none" }}>Abrir DHgate</a>
                <a href="https://www.redmagic.gg/" target="_blank" rel="noopener noreferrer" style={{ ...btnBase, textDecoration: "none" }}>Abrir RedMagic</a>
                <a href="https://www.huion.com/" target="_blank" rel="noopener noreferrer" style={{ ...btnBase, textDecoration: "none" }}>Huion</a>
                <a href="https://www.banggood.com/" target="_blank" rel="noopener noreferrer" style={{ ...btnBase, textDecoration: "none" }}>Banggood</a>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input
                  style={{ ...inputStyle, flex: "1 1 260px" }}
                  placeholder="https://www.amazon.com/dp/... o enlace de otra tienda"
                  value={pasteUrl}
                  onChange={(e) => setPasteUrl(e.target.value)}
                />
                <button style={btnBlue} onClick={() => void handleExtract()} disabled={extracting}>
                  {extracting ? "Extrayendo..." : "Extraer datos"}
                </button>
              </div>
              <p style={{ fontSize: 12, color: "#737373", margin: "8px 0 0" }}>
                Abre la tienda, copia el link del producto y pégalo aquí. La extracción rellena lo posible; revisa antes de guardar.
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
                      <option value="DHgate">DHgate</option>
                      <option value="RedMagic">RedMagic</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Categoría</label>
                    <select style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      <option value="">Selecciona una categoría</option>
                      {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                      {form.category && !categories.some((c) => c.name === form.category) && <option value={form.category}>{form.category}</option>}
                    </select>
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

                <div style={{ marginTop: 14, padding: 14, border: "1px solid #e5e5e5", borderRadius: 12, background: "#fff" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#737373", marginBottom: 8 }}>Gestor de categorías</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    <input style={{ ...inputStyle, flex: "1 1 220px" }} placeholder="Nueva categoría..." value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                    <button type="button" style={btnBase} onClick={() => void addCategory()}>Agregar categoría</button>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {categories.length === 0 && <span style={{ fontSize: 12, color: "#737373" }}>Aún no hay categorías guardadas.</span>}
                    {categories.map((c) => (
                      <span key={c.id} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", border: "1px solid #e5e5e5", borderRadius: 999, fontSize: 12, background: "#fafafa" }}>
                        {c.name}
                        <button type="button" onClick={() => void removeCategory(c.id)} style={{ border: 0, background: "transparent", cursor: "pointer", color: "#525252", fontSize: 12 }}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {form.imageUrl && (
                  <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 64, height: 64, border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", background: "#f9fafb", display: "grid", placeItems: "center" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.imageUrl} alt="Vista previa" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                    <span style={{ fontSize: 12, color: "#737373" }}>Vista previa</span>
                  </div>
                )}
              </div>

              {/* Paso 3: contenido ES */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
                  <div style={{ ...sectionTitle, margin: 0 }}>3 · Contenido en español</div>
                  <button type="button" style={btnBase} disabled={translating.size > 0} onClick={() => { void translateField("name", "en", "es"); void translateField("description", "en", "es"); void translateField("badge", "en", "es"); void translateField("priceNote", "en", "es"); }}>
                    {[...translating].some((k) => k.endsWith("-en-es")) ? "Traduciendo..." : "Traducir EN → ES"}
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <label style={labelStyle}>Nombre ES *</label>
                      <button type="button" style={{ ...btnBase, padding: "2px 8px", fontSize: 11 }} disabled={translating.has("name-es-en")} onClick={() => void translateField("name", "es", "en")}>{translating.has("name-es-en") ? "..." : "ES→EN"}</button>
                    </div>
                    <input style={inputStyle} value={form.nameEs} onChange={(e) => setForm({ ...form, nameEs: e.target.value })} required />
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <label style={labelStyle}>Badge ES (opcional)</label>
                      <button type="button" style={{ ...btnBase, padding: "2px 8px", fontSize: 11 }} disabled={translating.has("badge-es-en")} onClick={() => void translateField("badge", "es", "en")}>{translating.has("badge-es-en") ? "..." : "ES→EN"}</button>
                    </div>
                    <input style={inputStyle} placeholder="Ej. Top ventas" value={form.badgeEs} onChange={(e) => setForm({ ...form, badgeEs: e.target.value })} />
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <label style={labelStyle}>Precio nota ES</label>
                      <button type="button" style={{ ...btnBase, padding: "2px 8px", fontSize: 11 }} disabled={translating.has("priceNote-es-en")} onClick={() => void translateField("priceNote", "es", "en")}>{translating.has("priceNote-es-en") ? "..." : "ES→EN"}</button>
                    </div>
                    <input style={inputStyle} value={form.priceNoteEs} onChange={(e) => setForm({ ...form, priceNoteEs: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <label style={labelStyle}>Descripción ES</label>
                      <button type="button" style={{ ...btnBase, padding: "2px 8px", fontSize: 11 }} disabled={translating.has("description-es-en")} onClick={() => void translateField("description", "es", "en")}>{translating.has("description-es-en") ? "..." : "ES→EN"}</button>
                    </div>
                    <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={form.descriptionEs} onChange={(e) => setForm({ ...form, descriptionEs: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Paso 4: contenido EN */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
                  <div style={{ ...sectionTitle, margin: 0 }}>4 · Contenido en inglés</div>
                  <button type="button" style={btnBase} disabled={translating.size > 0} onClick={() => { void translateField("name", "es", "en"); void translateField("description", "es", "en"); void translateField("badge", "es", "en"); void translateField("priceNote", "es", "en"); }}>
                    {[...translating].some((k) => k.endsWith("-es-en")) ? "Traduciendo..." : "Traducir ES → EN"}
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <label style={labelStyle}>Nombre EN *</label>
                      <button type="button" style={{ ...btnBase, padding: "2px 8px", fontSize: 11 }} disabled={translating.has("name-en-es")} onClick={() => void translateField("name", "en", "es")}>{translating.has("name-en-es") ? "..." : "EN→ES"}</button>
                    </div>
                    <input style={inputStyle} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <label style={labelStyle}>Badge EN (opcional)</label>
                      <button type="button" style={{ ...btnBase, padding: "2px 8px", fontSize: 11 }} disabled={translating.has("badge-en-es")} onClick={() => void translateField("badge", "en", "es")}>{translating.has("badge-en-es") ? "..." : "EN→ES"}</button>
                    </div>
                    <input style={inputStyle} placeholder="E.g. Best seller" value={form.badgeEn} onChange={(e) => setForm({ ...form, badgeEn: e.target.value })} />
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <label style={labelStyle}>Precio nota EN</label>
                      <button type="button" style={{ ...btnBase, padding: "2px 8px", fontSize: 11 }} disabled={translating.has("priceNote-en-es")} onClick={() => void translateField("priceNote", "en", "es")}>{translating.has("priceNote-en-es") ? "..." : "EN→ES"}</button>
                    </div>
                    <input style={inputStyle} value={form.priceNoteEn} onChange={(e) => setForm({ ...form, priceNoteEn: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <label style={labelStyle}>Descripción EN</label>
                      <button type="button" style={{ ...btnBase, padding: "2px 8px", fontSize: 11 }} disabled={translating.has("description-en-es")} onClick={() => void translateField("description", "en", "es")}>{translating.has("description-en-es") ? "..." : "EN→ES"}</button>
                    </div>
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