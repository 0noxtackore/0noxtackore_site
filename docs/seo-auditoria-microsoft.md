# Auditoría SEO — comparativa con microsoft.com

> Fecha: 2026-11-20 · Página analizada: `https://www.microsoft.com/es-ve` (home geo-localizada)
> Objetivo: aprender de un sitio con décadas de SEO. **No copiar: adoptar lo que aplique.**

---

## 1. Lo que hace Microsoft (y qué adoptamos)

| Elemento | Microsoft | 0NOXTACKORE | Estado |
|---|---|---|---|
| **`<title>`** | `Microsoft: IA, nube, productividad, juegos y aplicaciones` (61 car.) — marca primero + categorías con comas | `0NOXTACKORE — Desarrollo de software y consultoría tecnológica` (~61 car.) — marca primero | ✅ ya lo cumple |
| **Meta descripción** | ~140 car., empieza con verbo (`Explora…`), nombra productos, cierra con «y mucho más» | 153 car., marca + keywords de servicio + cierre con eslogan | ✅ ya lo cumple |
| **`<meta name="robots">`** | `index, follow` | `index, follow` | ✅ |
| **Canonical** | `https://www.microsoft.com/es-ve` (localizada) | `https://0noxtackore.makes.fyi/es` (localizada) | ✅ |
| **hreflang** | ~100 variantes regionales + `x-default` | `es` / `en` + `x-default` → `/es` | ✅ escala correcta |
| **Favicon** | **Un solo** `/favicon.ico?v2`, sin `sizes`, sin PNG | `/favicon.ico` con **6 tamaños** (16→256) + `sizes="256x256"` | ✅ **mejor** |
| **JSON-LD** | **Ninguno** en la home | Organization + WebSite + FAQPage (+ Article / ProfilePage) | ✅ **mejor** |
| **`og:image`** | **No tiene** | 1200×630 con `alt` | ✅ **mejor** |
| **`twitter:card`** | `summary` (sin imagen) | `summary_large_image` + imagen | ✅ **mejor** |
| **Preconnect/preload** | ~15 `preconnect` + 5 preload de fuentes Segoe UI | Preload de logo, hero (desktop/móvil) y GA | ✅ (usamos fuentes de sistema: nada que precargar) |
| **`dir="ltr"`** | Sí | No lo tenía | 🔧 **adoptado** |
| **`theme-color`** | No lo tiene | — | 🔧 **adoptado** (`#0078d4`) |
| **`apple-touch-icon`** | No lo tiene | No lo tenía | 🔧 **adoptado** (`apple-icon.png` 180×180) |
| **Idioma del `<html>`** | `lang="es-VE"` (con región) | `lang="es"` | ✅ correcto (no tenemos variantes por país) |

### Conclusión técnica
En **etiquetas y datos estructurados vamos por delante** de la home de Microsoft. Su verdadera
ventaja no está en las etiquetas: está en la **autoridad de dominio** (25+ años, millones de
enlaces) y en el **contenido**. Nosotros compensamos con estructura correcta y riqueza de datos.

---

## 2. Lecciones concretas que sí aplicamos

1. **`dir="ltr"`** en `<html>` — Microsoft lo declara; evita ambigüedades de renderizado.
2. **`theme-color: #0078d4`** — color de la barra del navegador en móvil (el azul de marca).
3. **`apple-icon.png` (180×180)** — generado del logo con `sharp`. Apple **no acepta WebP/ICO**
   para el icono de pantalla de inicio; Microsoft tampoco lo tiene, pero iOS lo pide.
4. **Favicon con versionado** — Microsoft usa `/favicon.ico?v2` para forzar refresco cuando
   cambia. Next.js ya hace lo mismo con `?favicon.<hash>.ico`: si algún día cambiamos el
   archivo, el hash cambia y Google/buscadores lo re-leen.

---

## 3. Qué NO copiamos (y por qué)

- **~100 hreflang regionales** → innecesario: no tenemos variantes por país, solo por idioma.
- **`last-modified` meta, metas de telemetría (`awa-*`)** → ruido interno, cero valor SEO.
- **Ausencia de `og:image` / JSON-LD** → nosotros sí los tenemos; no retrocedemos.

---

## 4. Checklist heredado de esta auditoría

- [x] `dir="ltr"` en `<html>`
- [x] `theme-color` `#0078d4`
- [x] `apple-icon.png` 180×180
- [x] Title con marca al principio (≤ 65 car.)
- [x] Descripción 150–160 car.
- [x] robots `index, follow` + canonical localizada
- [x] hreflang recíproco + `x-default`
- [x] JSON-LD (Organization, WebSite, FAQPage)
- [ ] Verificar tras el próximo deploy que aparece `<link rel="apple-touch-icon">`
