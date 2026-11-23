export type StoreName = "Amazon" | "AliExpress";

export type StoreProductRecord = {
  id: string;
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
  badgeEs?: string;
  badgeEn?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type StoreProductInput = Omit<StoreProductRecord, "id" | "createdAt" | "updatedAt">;
