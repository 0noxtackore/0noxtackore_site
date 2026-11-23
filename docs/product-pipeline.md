# Pipeline de productos con agentes (0NOXTACKORE)

Sistema de 5 agentes gratuitos que buscan, redactan y preparan productos de la
tienda de afiliados. Todo entra a Firestore como **borrador oculto**
(`active=false`) para que lo revises y actives en `/admin`.

## Los 5 agentes

| Agente | Rol | Entrada → Salida |
| --- | --- | --- |
| `scout-amazon` | Busca 3-5 productos tech en Amazon (laptops, PC, gaming, accesorios) | websearch/webfetch → `tmp/products/amazon.json` |
| `scout-aliexpress` | Lo mismo para AliExpress | websearch/webfetch → `tmp/products/aliexpress.json` |
| `form-filler` | Convierte los hallazgos en borradores ES/EN con los campos exactos del admin | ambos JSON → `tmp/products/ready.json` |
| `marketer` | Aplica las skills `copywriting` + `marketing-psychology`: copy, beneficios, badges honestos | `ready.json` → `tmp/products/polished.json` |
| `publisher` | Importa a Firestore como borradores (nunca publica) | `polished.json` → Firestore + `tmp/products/imported.json` |

Orquestador: comando **`/product-pipeline`** (`.opencode/commands/product-pipeline.md`).

```
scout-amazon ─┐
              ├─→ form-filler ─→ marketer ─→ publisher ─→ Firestore (oculto)
scout-aliexpress ─┘
```

## Requisitos

1. `.env.local` local con (además de las vars existentes):
   ```env
   ADMIN_PASSWORD=tu_contraseña_de_Firebase_Auth
   ```
   - Es la contraseña del usuario `NEXT_PUBLIC_ADMIN_EMAIL` en Firebase Auth.
   - **Solo local**: nunca se sube a Vercel ni al repo (`.env.local` está en `.gitignore`).
2. Node.js disponible en `node` (ya usado por el repo).
3. OpenCode de escritorio instalado (proporciona `opencode-cli.exe`).

## Ejecución manual

- Desde OpenCode (TUI): `/product-pipeline`
- Desde PowerShell (modo headless, lo que usa la tarea programada):
  ```powershell
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts\run-pipeline.ps1
  ```

## Programación automática (24/7 con tu PC)

```powershell
schtasks /Create /TN "0noxtackore-product-pipeline" /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\Users\PC\Documents\PROGRAMATION\Corporation\0noxtackore\scripts\run-pipeline.ps1" /SC DAILY /ST 10:00 /F
```

- Corre 1 vez al día con **tu IP residencial** (sin bloqueos anti-bot de Amazon/AliExpress).
- Solo ejecuta si la PC está encendida y con sesión iniciada; ajusta la hora con `/ST HH:MM`.
- Ver / eliminar:
  ```powershell
  schtasks /Query /TN "0noxtackore-product-pipeline"
  schtasks /Delete /TN "0noxtackore-product-pipeline" /F
  ```

## Dónde mirar resultados

- **Tienda**: `/admin` → Productos (llegan como *Oculto*; actívalos tras revisar).
- **JSONs intermedios**: `tmp/products/*.json` (gitignored, temporales).
- **Logs de cada ejecución**: `tmp/products/logs/pipeline-*.log`.
- **Informe de importación**: `tmp/products/imported.json` (creados / omitidos / errores).

## Solución de problemas

| Síntoma | Causa y arreglo |
| --- | --- |
| `Falta ADMIN_PASSWORD en .env.local` | Agrega la línea en `.env.local` local y re-ejecuta. |
| `Autenticación fallida (INVALID_PASSWORD...)` | La contraseña o el correo no coinciden con `NEXT_PUBLIC_ADMIN_EMAIL`. |
| Scouts devuelven 0 ítems | Bloqueo anti-bot puntual; se reintenta en la próxima ejecución (usan búsqueda + Wayback como respaldo). |
| Error de créditos OpenRouter (`radixark/...`) | El runner fija `--model opencode/mimo-v2.6-flash-free` (gratis) en `run-pipeline.ps1`; no lo quites. |
| Ningún producto se crea | Revisa `tmp/products/imported.json` y el log; los duplicados se omiten a propósito. |

## Reglas de seguridad

- Los agentes solo pueden **escribir** dentro de `tmp/products/` (permisos en `.opencode/agents/*.md`).
- El publisher solo puede ejecutar `node scripts/*`.
- Nunca se pone `active=true` sin revisión humana.
- Credenciales solo en `.env.local` (gitignored) o Vercel env vars; jamás en el repo ni en el chat.
