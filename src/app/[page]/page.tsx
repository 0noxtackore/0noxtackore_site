import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { siteLocaleFromRequest } from "@/lib/i18n";

const PAGES = ["home", "guide", "about", "store", "philosophy", "recommendations", "trust", "projects", "contact", "privacy", "areas"];

export default async function PageWithoutLocale({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!PAGES.includes(page)) notFound();
  const h = await headers();
  const siteLocale = siteLocaleFromRequest(h.get("cf-ipcountry"), h.get("accept-language"));
  redirect(`/${page}/${siteLocale}`);
}
