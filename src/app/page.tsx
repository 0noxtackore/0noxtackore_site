import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { siteLocaleFromRequest } from "@/lib/i18n";

export default async function RootPage() {
  const h = await headers();
  const siteLocale = siteLocaleFromRequest(h.get("cf-ipcountry"), h.get("accept-language"));
  redirect(`/home/${siteLocale}`);
}
