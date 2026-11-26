import type { StoreName } from "./types";

export function withAffiliateTracking(url: string, store: StoreName): string {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (store === "Amazon" && host.includes("amazon.")) {
      const tag = process.env.NEXT_PUBLIC_AMAZON_TAG || process.env.AMAZON_TAG || "0noxtackore-20";
      if (tag) u.searchParams.set("tag", tag);
      return u.toString();
    }
    if (store === "AliExpress" && host.includes("aliexpress.")) {
      return u.toString();
    }
    if (store === "DHgate" && host.includes("dhgate.")) {
      return u.toString();
    }
    if (store === "RedMagic" && (host.includes("redmagic.") || host.includes("redmagic.gg"))) {
      return u.toString();
    }
    return url;
  } catch {
    return url;
  }
}
