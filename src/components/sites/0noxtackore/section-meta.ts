import type { Locale } from "@/lib/i18n";
import { getContent } from "./content";

export type SectionKey = "filosofia" | "recomendaciones" | "confianza" | "proyectos" | "contacto" | "areas";

export function sectionMeta(locale: Locale, section: SectionKey) {
  const content = getContent(locale);
  const ui = content.ui;

  switch (section) {
    case "filosofia":
      return {
        title: ui.philosophyTitle,
        description: content.philosophy.paragraphs[0] ?? content.brand.tagline,
      };
    case "recomendaciones":
      return {
        title: content.recommendation.title,
        description: content.recommendation.paragraphs[0] ?? ui.recKicker,
      };
    case "confianza":
      return {
        title: `${ui.trustTitlePrefix} ${content.brand.name}`,
        description: content.trust[0]?.description ?? content.brand.tagline,
      };
    case "proyectos":
      return { title: ui.projectsTitle, description: ui.projectsText ?? content.brand.approach };
    case "contacto": {
      const answer = content.faqs.find((item) => /contact/i.test(item.question))?.answer;
      return {
        title: ui.contact,
        description: answer ?? (locale === "es" ? "Canales de contacto de 0NOXTACKORE." : "0NOXTACKORE contact channels."),
      };
    }
    case "areas":
      return { title: ui.areasTitle, description: content.brand.approach };
  }
}
