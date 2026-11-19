"use client";

import Link from "next/link";

import { siteUrl } from "./data";
import { ShareButtons } from "./ShareButtons";
import styles from "./site.module.css";

const guideUrl = `${siteUrl}/guia`;
const guideTitle = "Cómo elegir una laptop con buena relación calidad-precio";
const guideDescription =
  "Guía práctica para evaluar procesador, memoria RAM, almacenamiento y batería antes de comprar una laptop, con criterios claros y sin promesas vacías.";

const sections = [
  { id: "uso", title: "1. Empieza por tu uso real" },
  { id: "procesador", title: "2. Procesador: Intel Core i5/i7 o AMD Ryzen" },
  { id: "ram", title: "3. Memoria RAM: 16 GB como base" },
  { id: "pantalla", title: "4. Pantalla, almacenamiento y batería" },
  { id: "checklist", title: "5. Checklist antes de comprar" },
  { id: "criterios", title: "6. Cómo evaluamos las recomendaciones" },
];

const checklist = [
  "Uso principal definido (estudio, desarrollo o edición).",
  "Procesador Intel Core i5/i7 o AMD Ryzen equivalente.",
  "16 GB de RAM o más.",
  "SSD NVMe de 512 GB o más.",
  "Pantalla IPS y batería acorde a tu movilidad.",
  "Garantía clara y vendedor de confianza.",
];

const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: guideTitle,
  description: guideDescription,
  image: `${siteUrl}/opengraph-image.jpg`,
  author: { "@type": "Organization", name: "0NOXTACKORE", url: siteUrl },
  publisher: { "@type": "Organization", name: "0NOXTACKORE", url: siteUrl },
  datePublished: "2026-11-19",
  mainEntityOfPage: guideUrl,
  inLanguage: "es",
}).replace(/</g, "\\u003c");

export function Guia() {
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <header className={styles.guideHeader}>
        <div className={styles.guideHeaderInner}>
          <Link className={styles.guideLogoLink} href="/" aria-label="0NOXTACKORE — Inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.guideLogo}
              src="/sites/0noxtackore/logo.webp"
              alt="0NOXTACKORE"
              width={280}
              height={87}
              decoding="async"
            />
          </Link>
          <Link className={styles.guideBack} href="/">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <section className={styles.guideHero}>
        <div className={styles.guideHeroInner}>
          <div className={styles.guideKicker}>Recomendación tecnológica</div>
          <h1 className={styles.guideTitle}>{guideTitle}</h1>
          <p className={styles.guideLead}>{guideDescription}</p>
          <p className={styles.guideMeta}>
            Por <span className={styles.thinBrand}>0NOXTACKORE</span> · Lectura de 4 min
          </p>
        </div>
      </section>

      <div className={styles.guideLayout}>
        <main className={styles.guideMain}>
          <section className={styles.guideSection} id="uso">
            <h2 className={styles.guideH2}>1. Empieza por tu uso real</h2>
            <p className={styles.guideP}>
              Antes de mirar cifras, define para qué necesitas el equipo: estudiar y ofimática,
              desarrollo de software, o diseño y edición. El mismo presupuesto rinde muy distinto
              según el caso, y comprar “lo más potente” casi nunca es la mejor decisión.
            </p>
          </section>

          <section className={styles.guideSection} id="procesador">
            <h2 className={styles.guideH2}>2. Procesador: Intel Core i5/i7 o AMD Ryzen</h2>
            <p className={styles.guideP}>
              Para la mayoría de tareas, un <strong>Core i5</strong> o un <strong>Ryzen 5</strong>{" "}
              actuales son más que suficientes. Los <strong>Core i7</strong> y{" "}
              <strong>Ryzen 7</strong> tienen sentido cuando compilas con frecuencia, usas
              máquinas virtuales o editas vídeo.
            </p>
          </section>

          <section className={styles.guideSection} id="ram">
            <h2 className={styles.guideH2}>3. Memoria RAM: 16 GB como base</h2>
            <p className={styles.guideP}>
              Con 8 GB te quedas corto en cuanto multitareas. <strong>16 GB</strong> es el punto
              dulce para desarrollo, navegación con muchas pestañas y herramientas modernas. Si tu
              trabajo es muy pesado, valora 32 GB.
            </p>
          </section>

          <section className={styles.guideSection} id="pantalla">
            <h2 className={styles.guideH2}>4. Pantalla, almacenamiento y batería</h2>
            <p className={styles.guideP}>
              Un <strong>SSD NVMe</strong> marca más diferencia percibida que cualquier otro
              componente: busca al menos 512 GB. Prefiere paneles <strong>IPS</strong> y elige una
              batería acorde a cuántas horas estarás lejos del enchufe.
            </p>
          </section>

          <section className={styles.guideSection} id="checklist">
            <h2 className={styles.guideH2}>5. Checklist antes de comprar</h2>
            <ul className={styles.guideChecklist}>
              {checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className={styles.guideSection} id="criterios">
            <h2 className={styles.guideH2}>6. Cómo evaluamos las recomendaciones</h2>
            <p className={styles.guideP}>
              No actuamos como fabricantes ni vendedores directos de los equipos. Solo seleccionamos
              y recomendamos productos disponibles en plataformas comerciales, evaluando sus
              especificaciones técnicas, rendimiento y relación calidad-precio. Si compras a través
              de enlaces de afiliación podemos recibir una comisión, sin coste adicional para ti.
            </p>
            <p className={styles.guideCallout}>
              Transparencia: nuestra recomendación depende de criterios técnicos, no de qué
              producto nos deje mayor comisión.
            </p>
          </section>

          <section className={styles.guideStoreNotice}>
            <h2 className={styles.guideH2}>Próximamente: tienda de equipos seleccionados</h2>
            <p className={styles.guideP}>
              Estamos preparando una sección para que puedas ver directamente los equipos que
              cumplen estos criterios. Mientras tanto, puedes seguirnos para enterarte del lanzamiento.
            </p>
            <Link className={`${styles.button} ${styles.buttonBlue}`} href="/#recomendaciones">
              Ver recomendaciones en la web
            </Link>
          </section>
        </main>

        <aside className={styles.guideAside}>
          <div className={styles.guideToc}>
            <div className={styles.guideTocTitle}>En esta guía</div>
            {sections.map((section) => (
              <a key={section.id} className={styles.guideTocLink} href={`#${section.id}`}>
                {section.title}
              </a>
            ))}
          </div>
        </aside>
      </div>

      <section className={styles.guideShare}>
        <div className={styles.guideShareInner}>
          <h2 className={styles.guideH2}>¿Te sirvió la guía? Compártela</h2>
          <p className={styles.guideP}>
            Puede ayudar a alguien que está a punto de comprar un equipo y no sabe por dónde empezar.
          </p>
          <ShareButtons url={guideUrl} text={guideDescription} />
        </div>
      </section>
    </div>
  );
}
