# 📌 Notas y pendientes de 0NOXTACKORE

> Última actualización: 2026-11-19
> Pregúntame: **«¿qué nos falta por hacer?»** y reviso este archivo para recordártelo.

---

## 1. Pendientes que el usuario pospuso (decisión pendiente)

Estos 4 puntos se revisaron (recomendaciones de auditoría externa) pero se dejaron **para después**:

- [ ] **Política de privacidad** — Obligatoria: el sitio usa Google Analytics 4 (cookies/medición) y Vercel Analytics. Falta una página `/politica-de-privacidad` (es y en).
- [ ] **Correo de contacto empresarial visible** — Falta definir y mostrar un email profesional en la web (sección de contacto y pie).
- [ ] **Decisión sobre Aguickore** — ¿Archivar el repositorio o mantenerlo? Nota: es el repo más activo (push reciente, licencia MIT). El usuario decide.
- [ ] **Páginas individuales por producto** — Crear una página propia por producto disponible (Fluxckore, Netckore, File-Host…) con documentación, licencia y estado.

## 2. SEO y buscadores

- [ ] **Verificar tras el próximo deploy que aparece `<link rel="apple-touch-icon">`** ✅ hecho (2026-11-20): `<link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" type="image/png"/>` + `dir="ltr"` + `theme-color` adoptados de la auditoría Microsoft.
- [x] **Revisión vs microsoft.com (2026-11-20)**: adoptado formato de title tipo `Marca: nichos` (`0NOXTACKORE: software a medida, open source y consultoría`), descripciones acortadas a ~150-160 car., imágenes OG por idioma (`og-es.jpg` / `og-en.jpg`), logo de apple touch. Nuestras etiquetas ya superaban a Microsoft en JSON-LD/OG/Twitter.
- [ ] **Verificar en ~3 días** (2026-11-22) que en Google: (a) aparece el **favicon** en los resultados para "0noxtackore", (b) el **título** muestra el nuevo formato. Se pidió re-indexación de `/es` y `/en` el 2026-11-19 vía GSC.
- [x] **Añadir el canal de YouTube al `sameAs`** — Hecho el 2026-11-19 (`fbdebed`): Organization schema, sección "Síguenos", FAQ y llms.txt. Canal: `https://www.youtube.com/@0noxtackore`.

- [ ] **Confirmar en Google Search Console** que el sitemap con 6 URLs (es/en) se procesó bien tras el cambio de idiomas; pedir indexación de `/es` y `/en`.
- [ ] **Re-enviar sitemap en Bing Webmaster** tras el cambio de rutas.
- [ ] **Confirmación por email de AgentDomains** para `0noxtackore.makes.fyi` (~30 días desde la solicitud). **No eliminar el registro TXT de Google** (`google-site-verification=LEwHRH4lzem8EG_-0NRVL6ciytTOTeQD1qs40Pj-ZtI`).
- [ ] IndexNow tras deploys relevantes: `npm run indexnow`.

## 3. Contenido y confianza

- [ ] **Testimonios reales** — La sección está preparada pero desactivada (`testimonials: []` en `content.ts`). No inventar testimonios: solo se activa con casos reales de la compañía.
- [ ] **Blog / recursos** — No iniciado. Ayuda al posicionamiento a medio plazo.
- [ ] **Prueba social adicional** — capturas de proyectos, métricas reales, etc.

## 4. Negocio

- [ ] **Google Ads** (Plan C) — cuando haya presupuesto: anuncios para la búsqueda «0noxtackore» + medición de conversiones. Necesita cuenta de Google Ads y una landing de destino.
- [ ] **Tienda** — fase final prevista. Antes: productos con página propia y política de privacidad.
- [ ] **Testimonios/prueba social** antes de pedir confianza a clientes.

## 5. Técnico menor

- [ ] `npm audit` reporta 23 vulnerabilidades (14 moderadas, 7 altas, 2 críticas) del template base. Revisar sin romper nada.
- [ ] `data.ts` quedó como contenido legado (solo se usan tipos y constantes). Limpiar cuando toque.
- [ ] Verificar en el dashboard de Vercel que **Analytics** y **Speed Insights** estén habilitados (botón «Enable»).

---

### Contexto rápido

- Dominio: `https://0noxtackore.makes.fyi` (proxy de AgentDomains → Vercel `0noxtackore-site.vercel.app`)
- Repo: `0noxtackore/0noxtackore_site` (rama `main`)
- Idiomas: `/es` y `/en` con hreflang; `/` redirige a `/es`
- GA4: `G-GF6XLVQRD1` · IndexNow key: `78b8ca671862cf7827495cfa5d0eba98`
- Comandos: `npm run check` (lint+typecheck+build) antes de cada commit · `npm run indexnow` tras deploys
