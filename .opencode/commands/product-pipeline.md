---
description: Pipeline completo de productos: scouts (Amazon+AliExpress) → formulario ES/EN → marketing → borradores en Firestore
model: opencode/mimo-v2.6-flash-free
---

Ejecuta el pipeline completo de productos de la tienda 0NOXTACKORE. Argumentos recibidos: $ARGUMENTS

## Secuencia obligatoria

1. **Preparación**: asegúrate de que exista el directorio `tmp/products/` (créalolo con shell `mkdir` si falta).

2. **Scouts en paralelo**: lanza a la vez los subagentes `scout-amazon` y `scout-aliexpress` con la herramienta `subagent` (dos llamadas, una tras otra sin esperar). Espera a que ambos terminen y lean sus informes.
   - Cada uno debe escribir `tmp/products/amazon.json` / `tmp/products/aliexpress.json` con 3-5 ítems.
   - Si un scout falla o no encuentra nada, continúa con lo que haya; si **ambos** están vacíos, para aquí y explica por qué (probablemente bloqueo anti-bot).

3. **Formulario**: lanza `form-filler` (lee ambos JSON + `seen.json` → escribe `tmp/products/ready.json` con borradores ES/EN, `active=false`, sin duplicados).

4. **Marketing**: lanza `marketer` (lee `ready.json` → escribe `polished.json`; debe cargar las skills `copywriting` y `marketing-psychology`).

5. **Importación**: lanza `publisher` (ejecuta `node scripts/import-drafts.mjs` → crea los borradores en Firestore y escribe `tmp/products/imported.json`).

6. **Resumen final** para el usuario: cuántos borradores creados (por tienda), cuántos omitidos por duplicado, errores si los hay, y un recordatorio de que están en `https://0noxtackore.makes.fyi/admin` como **ocultos**, listos para revisión y activación.

## Reglas

- **Nunca** pongas `active=true` ni publiques nada sin revisión humana.
- No edites código del proyecto ni archivos fuera de `tmp/products/` (los agents tienen permisos restringidos; respétalos).
- Lanza las etapas en orden y en paralelo solo cuando se indique (scouts). No saltes etapas.
- Si una etapa falla, reporta el error exacto y continúa solo si tiene sentido; si no, detente y explica.
