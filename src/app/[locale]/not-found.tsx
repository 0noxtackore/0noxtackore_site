"use client";

import { useParams } from "next/navigation";

import { NotFoundContent } from "@/components/sites/0noxtackore/NotFound";
import { isLocale, type Locale } from "@/lib/i18n";

export default function LocaleNotFound() {
  const params = useParams<{ locale?: string }>();
  const locale: Locale = params?.locale && isLocale(params.locale) ? params.locale : "es";
  return <NotFoundContent locale={locale} />;
}
