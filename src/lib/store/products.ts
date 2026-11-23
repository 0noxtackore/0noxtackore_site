import "server-only";

import type { StoreProductRecord, StoreName } from "./types";

type FirestoreValue =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { nullValue: null };

type FirestoreDoc = {
  name: string;
  fields?: Record<string, FirestoreValue>;
};

function str(fields: Record<string, FirestoreValue> | undefined, key: string): string {
  const v = fields?.[key];
  return v && "stringValue" in v ? v.stringValue : "";
}
function bool(fields: Record<string, FirestoreValue> | undefined, key: string): boolean {
  const v = fields?.[key];
  return v && "booleanValue" in v ? v.booleanValue : false;
}

function docToProduct(doc: FirestoreDoc): StoreProductRecord | null {
  const id = doc.name.split("/").pop();
  if (!id) return null;
  const f = doc.fields;
  const store = str(f, "store");
  if (store !== "Amazon" && store !== "AliExpress") return null;
  return {
    id,
    active: bool(f, "active"),
    store: store as StoreName,
    category: str(f, "category"),
    affiliateUrl: str(f, "affiliateUrl"),
    imageUrl: str(f, "imageUrl"),
    imageSource: str(f, "imageSource") === "custom" ? "custom" : "affiliate",
    priceNoteEs: str(f, "priceNoteEs"),
    priceNoteEn: str(f, "priceNoteEn"),
    nameEs: str(f, "nameEs"),
    nameEn: str(f, "nameEn"),
    descriptionEs: str(f, "descriptionEs"),
    descriptionEn: str(f, "descriptionEn"),
    badgeEs: str(f, "badgeEs") || undefined,
    badgeEn: str(f, "badgeEn") || undefined,
    createdAt: str(f, "createdAt") || undefined,
    updatedAt: str(f, "updatedAt") || undefined,
  };
}

export async function getActiveProducts(): Promise<StoreProductRecord[]> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!projectId || !apiKey) return [];

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products?pageSize=100&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { documents?: FirestoreDoc[] };
    const products = (data.documents ?? [])
      .map(docToProduct)
      .filter((p): p is StoreProductRecord => p !== null && p.active);
    return products.sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
  } catch {
    return [];
  }
}

export async function getActiveProductById(id: string): Promise<StoreProductRecord | null> {
  const products = await getActiveProducts();
  return products.find((p) => p.id === id) ?? null;
}
