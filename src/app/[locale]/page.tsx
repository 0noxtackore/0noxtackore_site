import { notFound } from "next/navigation";

import { Site } from "@/components/sites/0noxtackore/Site";
import { isLocale } from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Site locale={locale} />;
}
