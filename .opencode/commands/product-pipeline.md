---
description: Pipeline autónomo de productos con agentes OpenCode: investiga, optimiza, importa y publica solo lo validado
---

Ejecuta el pipeline de productos 0NOXTACKORE usando agentes OpenCode (sin Ollama). Argumentos: $ARGUMENTS

## Secuencia

1. **Preparación**: crea `tmp/products/` si falta.
2. **Investigación**: lanza `catalog-researcher` para buscar productos tech reales y escribir `tmp/products/polished.json` (solo datos verificados).
3. **Optimización**: lanza `listing-optimizer` para limpiar ES/EN, categorías, badges y quitar ítems débiles en `tmp/products/polished.json`.
4. **Validación + publicación**: lanza `quality-gate-publisher` para ejecutar `import-drafts.mjs`, `publish-drafts.mjs --dry-run` y `publish-drafts.mjs` si procede. Solo se publican los que pasan validación.
5. **Marketing (opcional)**: si se pidió contenido, lanza `marketing-content` para generar copys en `tmp/marketing/`.
6. **Resumen**: reporta investigados/importados/publicados/rechazados, razones de rechazo y archivos de reporte.

## Reglas

- No inventar datos de producto. Si no hay evidencia, descartar.
- No editar código del proyecto ni archivos fuera de `tmp/products/` o `tmp/marketing/`.
- Publicación solo mediante `publish-drafts.mjs` (validación obligatoria).
- Si faltan credenciales/env, detenerse y reportar exactamente qué falta.
