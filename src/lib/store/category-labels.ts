import type { Locale } from "@/lib/i18n";

const ES_TO_EN: Record<string, string> = {
  // Categorías usadas por el importador y el admin
  Accesorios: "Accessories",
  "PC & Componentes": "PC & Components",
  "Memorias RAM": "RAM",
  Laptops: "Laptops",
  Smartphones: "Smartphones",
  Gaming: "Gaming",
  Audio: "Audio",
  "Smart Home": "Smart Home",
  // Catálogo fijo de STORE_CATEGORIES
  "PC de escritorio": "Desktop PCs",
  "Componentes PC": "PC components",
  Procesadores: "Processors",
  "Tarjetas gráficas": "Graphics cards",
  "Placas base": "Motherboards",
  "Almacenamiento (SSD/HDD)": "Storage (SSD/HDD)",
  "Fuentes de poder": "Power supplies",
  "Gabinetes/Cases": "Cases",
  "Refrigeración": "Cooling",
  Monitores: "Monitors",
  Teclados: "Keyboards",
  Ratones: "Mice",
  "Auriculares y audio": "Headphones & audio",
  Parlantes: "Speakers",
  "Micrófonos": "Microphones",
  Webcams: "Webcams",
  "Impresoras y escáneres": "Printers & scanners",
  "Redes y Wi-Fi": "Networking & Wi-Fi",
  "Routers y módems": "Routers & modems",
  "NAS y servidores": "NAS & servers",
  Tablets: "Tablets",
  "Accesorios para móvil": "Mobile accessories",
  "Cargadores y energía": "Chargers & power",
  "Cables y adaptadores": "Cables & adapters",
  "Hubs y docks": "Hubs & docks",
  Consolas: "Consoles",
  "Mandos y controles": "Controllers",
  "Accesorios gaming": "Gaming accessories",
  "Sillas gaming": "Gaming chairs",
  Wearables: "Wearables",
  "Cámaras y fotografía": "Cameras & photography",
  Drones: "Drones",
  "TV y streaming": "TV & streaming",
  Proyectores: "Projectors",
  "Almacenamiento externo": "External storage",
  "Software y licencias": "Software & licenses",
  "Oficina y productividad": "Office & productivity",
  "Iluminación LED/RGB": "LED/RGB lighting",
  "Protección y seguridad": "Security & protection",
  Otros: "Other",
};

export function categoryLabel(category: string, locale: Locale): string {
  const value = String(category || "").trim();
  if (locale === "es") return value;
  return ES_TO_EN[value] ?? value;
}
