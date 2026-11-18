# Tus imágenes

Guarda aquí tus imágenes con **estos nombres exactos** y yo las integro al sitio.

| Archivo | Tamaño recomendado | Para qué |
| --- | --- | --- |
| `hero.png` o `hero.jpg` | 1920×1080 (16:9) | Fondo del hero. Deja el **lado izquierdo** con poco contenido: ahí va el título "BUILT FOR IMPACT". |
| `area-software.png` o `.jpg` | 1200×675 (16:9) | Tarjeta "Desarrollo de software" |
| `area-opensource.png` o `.jpg` | 1200×675 (16:9) | Tarjeta "Ingeniería y evolución de proyectos open source" |
| `area-integrations.png` o `.jpg` | 1200×675 (16:9) | Tarjeta "Tecnologías e integraciones" |
| `area-products.png` o `.jpg` | 1200×675 (16:9) | Tarjeta "Productos tecnológicos" |
| `area-recommendations.png` o `.jpg` | 1200×675 (16:9) | Tarjeta "Recomendación y afiliación tecnológica" |

## Consejos

- Formato: PNG o JPG. Si pesan más de ~1 MB cada una, las comprimo yo.
- Sin texto dentro de la imagen: el sitio ya pone los títulos encima.
- Evita logos de otras marcas.
- Estilo sugerido: azul marino / azul eléctrico para que combine con el hero; pero puedes usar el estilo que quieras y yo ajusto los colores del sitio.
- Si haces menos de 6, dime cuáles faltan y dejo las fotos de Pexels en esas tarjetas.

## Qué hago yo después

1. Verifico que carguen y sus dimensiones.
2. Actualizo las rutas en `src/components/sites/0noxtackore/data.ts`.
3. Ajusto `object-fit`, recorte y colores si hace falta.
4. Corro `npm run check` y lo reviso en el navegador.
