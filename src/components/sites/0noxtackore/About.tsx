"use client";

import Link from "next/link";

import { siteUrl } from "./data";
import styles from "./site.module.css";

const aboutUrl = `${siteUrl}/acerca`;

const projects = [
  {
    name: "Fluxckore",
    description:
      "Utilidad de limpieza y optimización para Windows, construida con una interfaz ligera y sin dependencias pesadas.",
    url: "https://github.com/0noxtackore/Fluxckore",
  },
  {
    name: "Netckore",
    description:
      "Herramienta de diagnóstico y reparación de conexión a internet, con interfaz autónoma y soporte multilenguaje.",
    url: "https://github.com/0noxtackore/Netckore",
  },
  {
    name: "Aguickore",
    description:
      "Protocolo y ecosistema de SDK para conectar agentes de IA con aplicaciones, mantenido como una evolución hardening de AG-UI.",
    url: "https://github.com/0noxtackore/Aguickore",
  },
  {
    name: "Ebenezer-Screen",
    description:
      "Aplicación web para el control de pantallas y gestión de contenido multimedia, desplegada en Netlify.",
    url: "https://github.com/0noxtackore/Ebenezer-Screen",
  },
  {
    name: "File-Host",
    description:
      "Aplicación ligera de alojamiento y compartición de archivos en la nube, optimizada para despliegue rápido.",
    url: "https://github.com/0noxtackore/File-Host",
  },
];

const officialLinks = [
  { label: "GitHub", url: "https://github.com/0noxtackore" },
  {
    label: "Facebook",
    url: "https://www.facebook.com/people/0noxtackore/61567098773222/",
  },
  { label: "Instagram", url: "https://www.instagram.com/0noxtackore.dev/" },
];

const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: "Acerca de 0NOXTACKORE",
  url: aboutUrl,
  mainEntity: {
    "@type": "Organization",
    name: "0NOXTACKORE",
    url: siteUrl,
    logo: `${siteUrl}/sites/0noxtackore/logo.webp`,
    foundingDate: "2026",
    areaServed: { "@type": "Place", name: "Global" },
    sameAs: officialLinks.map((l) => l.url),
  },
  inLanguage: "es",
}).replace(/</g, "\\u003c");

export function About() {
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
          <div className={styles.guideKicker}>Sobre la marca</div>
          <h1 className={styles.guideTitle}>Acerca de 0NOXTACKORE</h1>
          <p className={styles.guideLead}>
            Un estudio tecnológico independiente y una marca construida desde cero, con una sola
            persona al frente: diseñar, programar y liderar al mismo tiempo.
          </p>
          <p className={styles.guideMeta}>
            <span className={styles.thinBrand}>0NOXTACKORE</span> · BUILT FOR IMPACT
          </p>
        </div>
      </section>

      <div className={styles.guideLayout}>
        <main className={styles.guideMain}>
          <section className={styles.guideSection}>
            <h2 className={styles.guideH2}>Quién hay detrás</h2>
            <p className={styles.guideP}>
              <span className={styles.thinBrand}>0noxtackore</span> es un estudio tecnológico indie
              fundado por un único desarrollador con una visión clara: una persona que lidera,
              programa y diseña al mismo tiempo. Como arquitecto de software, el foco está en
              construir sistemas de alto rendimiento desde la base, priorizando la escalabilidad y
              una ingeniería limpia.
            </p>
            <p className={styles.guideP}>
              Esta web es el hogar oficial de la marca: aquí reunimos lo que hacemos, nuestra
              filosofía y los productos y proyectos que desarrollamos. La tecnología con propósito
              no es un eslogan: es la forma en que abordamos cada proyecto.
            </p>
          </section>

          <section className={styles.guideSection}>
            <h2 className={styles.guideH2}>Qué construimos</h2>
            <p className={styles.guideP}>
              Parte de nuestro trabajo son productos y proyectos de código abierto que ya están
              disponibles públicamente:
            </p>
            <div className={styles.aboutProjects}>
              {projects.map((project) => (
                <a
                  key={project.name}
                  className={styles.aboutProject}
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <h3 className={styles.aboutProjectName}>{project.name} ↗</h3>
                  <p className={styles.aboutProjectText}>{project.description}</p>
                </a>
              ))}
            </div>
          </section>

          <section className={styles.guideSection}>
            <h2 className={styles.guideH2}>Filosofía</h2>
            <p className={styles.guideP}>
              No necesitamos inventar una tecnología completamente nueva cada vez. Aprovechamos los
              avances existentes, aprendemos de ellos y aportamos mejoras que resuelven necesidades
              reales, respetando siempre licencias y autores. Innovación responsable, colaboración,
              transparencia y mejora continua.
            </p>
          </section>

          <section className={styles.guideSection}>
            <h2 className={styles.guideH2}>Presencia oficial</h2>
            <p className={styles.guideP}>
              Puedes encontrarnos y seguir nuestro trabajo en estos canales oficiales:
            </p>
            <div className={styles.aboutLinks}>
              {officialLinks.map((link) => (
                <a
                  key={link.label}
                  className={styles.aboutLink}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </section>
        </main>

        <aside className={styles.guideAside}>
          <div className={styles.guideToc}>
            <div className={styles.guideTocTitle}>En esta página</div>
            <Link className={styles.guideTocLink} href="/#confianza">
              Por qué confiar en la marca
            </Link>
            <Link className={styles.guideTocLink} href="/#faq">
              Preguntas frecuentes
            </Link>
            <Link className={styles.guideTocLink} href="/guia">
              Guía para elegir una laptop
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
