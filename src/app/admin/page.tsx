"use client";

import { useEffect, useState } from "react";
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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { auth, db, storage } from "@/lib/firebase/client";
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

  const allowedEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "").trim().toLowerCase();
  const isAllowed = !!user && (!allowedEmail || user.email?.toLowerCase() === allowedEmail);

  async function loadProducts() {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("updatedAt", "desc"));
      const snap = await getDocs(q);
      setProducts(snap.docs.map((d) => toRecord(d.id, d.data() as Record<string, unknown>)));
    } catch (e) {
      setStatus(`Error cargando productos: ${String(e)}`);
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
      if (!res.ok) throw new Error(json.error || "extract failed");
      const d = json.data as { name: string; description: string; imageUrl: string; store: string; priceNote: string; affiliateUrl: string };
      const store: StoreName = d.store === "AliExpress" ? "AliExpress" : "Amazon";
      setForm((f) => ({
        ...f,
        store,
        affiliateUrl: d.affiliateUrl || pasteUrl.trim(),
        imageUrl: d.imageUrl || f.imageUrl,
        imageSource: d.imageUrl ? "affiliate" : f.imageSource,
        nameEs: f.nameEs || d.name,
        nameEn: f.nameEn || d.name,
        descriptionEs: f.descriptionEs || d.description,
        descriptionEn: f.descriptionEn || d.description,
        priceNoteEs: f.priceNoteEs || (store === "Amazon" ? "Precio en Amazon" : "Precio en AliExpress"),
        priceNoteEn: f.priceNoteEn || (store === "Amazon" ? "Price on Amazon" : "Price on AliExpress"),
      }));
      setStatus("Datos extraídos (best-effort). Revisa y completa ES/EN antes de guardar.");
    } catch (err) {
      setStatus(`No se pudo extraer: ${String(err)}. Puedes llenar el formulario manualmente.`);
      setForm((f) => ({ ...f, affiliateUrl: f.affiliateUrl || pasteUrl.trim() }));
    } finally {
      setExtracting(false);
    }
  }

  async function handleImageUpload(file: File) {
    if (!file) return;
    setStatus("Subiendo imagen...");
    try {
      const path = `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm((f) => ({ ...f, imageUrl: url, imageSource: "custom" }));
      setStatus("Imagen subida.");
    } catch (err) {
      setStatus(`Error subiendo imagen: ${String(err)}`);
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
        setStatus("Producto actualizado.");
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setStatus("Producto creado.");
      }
      setForm(emptyForm());
      setPasteUrl("");
      await loadProducts();
    } catch (err) {
      setStatus(`Error guardando: ${String(err)}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      await loadProducts();
    } catch (err) {
      setStatus(`Error eliminando: ${String(err)}`);
    }
  }

  async function toggleActive(p: StoreProductRecord) {
    try {
      await updateDoc(doc(db, "products", p.id), { active: !p.active, updatedAt: new Date().toISOString() });
      await loadProducts();
    } catch (err) {
      setStatus(`Error: ${String(err)}`);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const inputStyle: React.CSSProperties = { width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 };
  const cardStyle: React.CSSProperties = { background: "#fff", border: "1px solid #ddd", borderRadius: 12, padding: 20, marginBottom: 16 };

  if (!authReady) return <div style={{ padding: 40 }}>Cargando...</div>;

  if (!user) {
    return (
      <div style={{ maxWidth: 420, margin: "60px auto", padding: 24, background: "#fff", borderRadius: 12, border: "1px solid #ddd" }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Admin tienda</h1>
        <p style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>Acceso solo para administrador. Crea el usuario en Firebase Auth (Email/Password) y configura `NEXT_PUBLIC_ADMIN_EMAIL`.</p>
        <form onSubmit={handleLogin}>
          <label style={labelStyle}>Email</label>
          <input style={{ ...inputStyle, marginBottom: 12 }} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <label style={labelStyle}>Password</label>
          <input style={{ ...inputStyle, marginBottom: 16 }} value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          {authError && <p style={{ color: "crimson", fontSize: 13, marginBottom: 12 }}>{authError}</p>}
          <button style={{ padding: "10px 16px", background: "#0f1720", color: "#fff", border: 0, borderRadius: 8, cursor: "pointer" }} type="submit">Entrar</button>
        </form>
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

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, margin: 0 }}>Admin Tienda</h1>
          <p style={{ color: "#555", margin: "4px 0 0" }}>{user.email}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => void loadProducts()} style={{ padding: "8px 12px" }}>Recargar</button>
          <button onClick={() => signOut(auth)} style={{ padding: "8px 12px" }}>Salir</button>
        </div>
      </div>

      {status && <div style={{ ...cardStyle, background: "#f0f7ff", borderColor: "#bcd" }}>{status}</div>}

      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Agregar / editar producto</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input style={{ ...inputStyle, flex: 1 }} placeholder="Pega link de Amazon o AliExpress" value={pasteUrl} onChange={(e) => setPasteUrl(e.target.value)} />
          <button onClick={() => void handleExtract()} disabled={extracting} style={{ padding: "10px 14px" }}>{extracting ? "Extrayendo..." : "Extraer datos"}</button>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
            <div><label style={labelStyle}>Tienda</label><select style={inputStyle} value={form.store} onChange={(e) => setForm({ ...form, store: e.target.value as StoreName })}><option value="Amazon">Amazon</option><option value="AliExpress">AliExpress</option></select></div>
            <div><label style={labelStyle}>Categoría</label><input style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div><label style={labelStyle}>Badge ES</label><input style={inputStyle} value={form.badgeEs} onChange={(e) => setForm({ ...form, badgeEs: e.target.value })} /></div>
            <div><label style={labelStyle}>Badge EN</label><input style={inputStyle} value={form.badgeEn} onChange={(e) => setForm({ ...form, badgeEn: e.target.value })} /></div>
            <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>URL afiliada</label><input style={inputStyle} value={form.affiliateUrl} onChange={(e) => setForm({ ...form, affiliateUrl: e.target.value })} required /></div>
            <div><label style={labelStyle}>Nombre ES</label><input style={inputStyle} value={form.nameEs} onChange={(e) => setForm({ ...form, nameEs: e.target.value })} required /></div>
            <div><label style={labelStyle}>Nombre EN</label><input style={inputStyle} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required /></div>
            <div><label style={labelStyle}>Descripción ES</label><textarea style={{ ...inputStyle, minHeight: 80 }} value={form.descriptionEs} onChange={(e) => setForm({ ...form, descriptionEs: e.target.value })} /></div>
            <div><label style={labelStyle}>Descripción EN</label><textarea style={{ ...inputStyle, minHeight: 80 }} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} /></div>
            <div><label style={labelStyle}>Precio nota ES</label><input style={inputStyle} value={form.priceNoteEs} onChange={(e) => setForm({ ...form, priceNoteEs: e.target.value })} /></div>
            <div><label style={labelStyle}>Precio nota EN</label><input style={inputStyle} value={form.priceNoteEn} onChange={(e) => setForm({ ...form, priceNoteEn: e.target.value })} /></div>
            <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>URL imagen (afiliada o propia)</label><input style={inputStyle} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
            <div><label style={labelStyle}>Origen imagen</label><select style={inputStyle} value={form.imageSource} onChange={(e) => setForm({ ...form, imageSource: e.target.value as "affiliate" | "custom" })}><option value="affiliate">Afiliada / default</option><option value="custom">Propia</option></select></div>
            <div><label style={labelStyle}>Subir imagen propia (requiere Firebase Storage/Blaze)</label><input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleImageUpload(f); }} /></div>
          </div>
          <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Activo en tienda</label>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button disabled={saving} type="submit" style={{ padding: "10px 16px", background: "#0078d4", color: "#fff", border: 0, borderRadius: 8 }}>{saving ? "Guardando..." : form.id ? "Actualizar" : "Crear"}</button>
            {form.id && <button type="button" onClick={() => { setForm(emptyForm()); setPasteUrl(""); }} style={{ padding: "10px 16px" }}>Cancelar edición</button>}
          </div>
        </form>
      </div>

      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Productos ({products.length})</h2>
        {loading ? <p>Cargando...</p> : products.length === 0 ? <p>No hay productos.</p> : (
          <div style={{ display: "grid", gap: 12 }}>
            {products.map((p) => (
              <div key={p.id} style={{ border: "1px solid #e5e5e5", borderRadius: 10, padding: 14, display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 12, alignItems: "center" }}>
                <div style={{ width: 80, height: 80, background: "#f5f5f5", borderRadius: 8, overflow: "hidden" }}>
                  {p.imageUrl ? <img src={p.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : null}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{p.nameEs || p.nameEn}</div>
                  <div style={{ fontSize: 13, color: "#555" }}>{p.store} · {p.category} · {p.active ? "Activo" : "Oculto"}</div>
                  <div style={{ fontSize: 12, color: "#777", wordBreak: "break-all" }}>{p.affiliateUrl}</div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button onClick={() => editProduct(p)} style={{ padding: "6px 10px" }}>Editar</button>
                  <button onClick={() => void toggleActive(p)} style={{ padding: "6px 10px" }}>{p.active ? "Ocultar" : "Activar"}</button>
                  <button onClick={() => void handleDelete(p.id)} style={{ padding: "6px 10px", color: "crimson" }}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
