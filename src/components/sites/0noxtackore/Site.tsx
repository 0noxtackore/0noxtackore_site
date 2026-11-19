"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Code2,
  Eye,
  GitBranch,
  Laptop,
  Menu,
  MessagesSquare,
  Package,
  Plug,
  ShieldCheck,
  Star,
  X,
  type LucideIcon,
} from "lucide-react";

import {
  areas,
  brand,
  faqs,
  footerGroups,
  heroSlides,
  megaGroups,
  navLinks,
  philosophy,
  recommendation,
  trust,
  values,
  type Area,
} from "./data";
import { HeroSlider } from "./HeroSlider";
import styles from "./site.module.css";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const areaIcons: Record<Area["icon"], LucideIcon> = {
  code: Code2,
  branch: GitBranch,
  plug: Plug,
  package: Package,
  laptop: Laptop,
  messages: MessagesSquare,
};

const trustIcons: LucideIcon[] = [ShieldCheck, BadgeCheck, Eye, Star];

function BrandIntro({ text }: { text: string }) {
  const name = brand.name.toLowerCase();
  if (!text.toLowerCase().startsWith(name)) return <>{text}</>;

  return (
    <>
      <span className={styles.thinBrand}>{text.slice(0, name.length)}</span>
      {text.slice(name.length)}
    </>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className={styles.announce}>
        <div className={styles.announceInner}>
          <span className={styles.announceStrong}>{brand.name}</span>
          <span>{brand.tagline}</span>
          <a className={styles.announceLink} href="#filosofia">
            Conoce nuestra filosofía →
          </a>
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.logoLink} href="#inicio" aria-label={brand.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.logo}
              src="/sites/0noxtackore/logo.webp"
              alt={brand.name}
              width={32}
              height={32}
              decoding="async"
            />
          </a>

          <nav className={styles.nav} aria-label="Navegación principal">
            {navLinks.map((link) => (
              <a key={link.href} className={styles.navLink} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.navButton} ${menuOpen ? styles.navButtonOpen : ""}`}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              Todo <span className={styles.thinBrand}>{brand.name.toLowerCase()}</span>
            </button>
            <a className={styles.contactButton} href="#contacto">
              Contacto
            </a>
          </div>
        </div>

        {menuOpen && (
          <div className={styles.mega}>
            <div className={styles.megaGrid}>
              {megaGroups.map((group) => (
                <div key={group.title}>
                  <div className={styles.megaTitle}>{group.title}</div>
                  {group.links.map((link) => (
                    <a key={link.label} className={styles.megaLink} href={link.href}>
                      {link.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function SiteFooter() {
  return (
    <footer className={styles.footer} id="contacto">
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.footerLogo}
              src="/sites/0noxtackore/logo.webp"
              alt={brand.name}
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
            />
            <p className={styles.footerTagline}>{brand.tagline}</p>
            <p className={styles.footerIntro}>{brand.approach}</p>
          </div>
          <nav className={styles.footerGrid} aria-label="Enlaces del pie de página">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className={styles.footerGroupTitle}>{group.title}</h2>
                {group.links.map((link) => (
                  <a key={link.label} className={styles.footerLink} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className={styles.footerBottom}>
          <span>
            © 2026 <span className={styles.footerBrandName}>0NOXTACKORE</span> · BUILT FOR IMPACT
          </span>
          <span>Construimos tecnología con propósito.</span>
        </div>
      </div>
    </footer>
  );
}

export function Site() {
  return (
    <div className={styles.page}>
      <SiteHeader />

      <main>
        <section className={styles.hero} id="inicio" aria-labelledby="hero-title">
          <div className={styles.heroImageLayer}>
            <HeroSlider slides={heroSlides} />
          </div>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>{brand.heroEyebrow}</span>
              <h1 id="hero-title" className={styles.heroTitle}>
                {brand.tagline}
              </h1>
              <p className={styles.heroDescription}>
                <BrandIntro text={brand.intro} />
              </p>
              <div className={styles.heroActions}>
                <a className={`${styles.button} ${styles.buttonBlue}`} href="#areas">
                  Explorar áreas
                </a>
                <a className={`${styles.button} ${styles.buttonOutline}`} href="#filosofia">
                  Nuestra filosofía
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="areas" aria-labelledby="areas-title">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionKicker}>Qué hacemos</div>
              <h2 id="areas-title" className={styles.sectionTitle}>
                Áreas de actividad
              </h2>
              <p className={styles.sectionText}>{brand.approach}</p>
            </div>
            <div className={styles.cardGrid}>
              {areas.map((area) => {
                const Icon = areaIcons[area.icon];
                return (
                  <article key={area.title} className={styles.card}>
                    <div
                      className={styles.cardMedia}
                      style={{
                        backgroundImage: `url(${area.blur})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className={styles.cardImage}
                        src={area.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={960}
                        height={536}
                        style={{ opacity: 1, transition: "filter 0.25s ease, transform 0.25s ease" }}
                      />
                      <span className={styles.cardIconBadge}>
                        <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                    </div>
                    <div className={styles.cardBody}>
                      <h3 className={styles.cardTitle}>{area.title}</h3>
                      <p className={styles.cardText}>{area.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.philosophy}`} id="filosofia" aria-labelledby="filosofia-title">
          <div className={styles.sectionInner}>
            <div className={styles.philosophyGrid}>
              <div className={styles.philosophyText}>
                <div className={styles.sectionKicker}>Cómo pensamos</div>
                <h2 id="filosofia-title" className={styles.sectionTitle}>
                  Nuestra filosofía
                </h2>
                {philosophy.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <aside className={styles.quote} aria-label="Frase destacada">
                <div className={styles.quoteBar}>
                  <span className={styles.quoteDots} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className={styles.quoteFile}>0noxtackore/philosophy.ts</span>
                </div>
                <div className={styles.quoteBody}>
                  <span className={styles.quotePrompt} aria-hidden="true">
                    &gt;
                  </span>
                  <p className={styles.quoteText}>{philosophy.statement}</p>
                </div>
                <span className={styles.quoteMeta}>
                  <span className={styles.quoteKey}>impacto</span>: <span className={styles.quoteTrue}>true</span>
                </span>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles.section} id="recomendaciones" aria-labelledby="rec-title">
          <div className={styles.sectionInner}>
            <div className={styles.recGrid}>
              <div className={styles.recText}>
                <div className={styles.sectionKicker}>Tecnología útil</div>
                <h2 id="rec-title" className={styles.sectionTitle}>
                  {recommendation.title}
                </h2>
                {recommendation.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <div className={styles.chips}>
                  {recommendation.highlights.map((item) => (
                    <span key={item} className={styles.chip}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <aside className={styles.recAside}>
                <div
                  className={styles.recImage}
                  style={{
                    backgroundImage:
                      "url(data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAADQAQCdASoQAAkABUB8JZwC7ADM1D2IgAD+HVmUkq8pPEWWJ5q+z4BOAAA=)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/sites/0noxtackore/photos/recomendations.webp"
                    alt="Portátil con gráficas de análisis en pantalla"
                    loading="lazy"
                    decoding="async"
                    width={960}
                    height={536}
                  />
                </div>
                <p className={styles.disclaimer}>
                  No actuamos como fabricantes ni vendedores directos de los equipos. Solo seleccionamos
                  y recomendamos productos disponibles en plataformas comerciales.
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles.sectionTight} aria-labelledby="valores-title">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionKicker}>Principios</div>
              <h2 id="valores-title" className={styles.sectionTitle}>
                Lo que nos guía
              </h2>
            </div>
            <div className={styles.valueGrid}>
              {values.map((value, index) => (
                <article key={value.title} className={styles.valueCard}>
                  <span className={styles.valueNumber}>0{index + 1}</span>
                  <h3 className={styles.valueTitle}>{value.title}</h3>
                  <p className={styles.valueText}>{value.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.trust}`} id="confianza" aria-labelledby="confianza-title">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionKicker}>Transparencia</div>
              <h2 id="confianza-title" className={styles.sectionTitle}>
                Por qué confiar en <span className={styles.thinBrand}>0NOXTACKORE</span>
              </h2>
              <p className={styles.sectionText}>
                Construimos tecnología con propósito, con criterios claros y una forma de trabajar
                abierta y responsable.
              </p>
            </div>
            <div className={styles.trustGrid}>
              {trust.map((item, index) => {
                const Icon = trustIcons[index % trustIcons.length];
                return (
                  <article key={item.title} className={styles.trustItem}>
                    <span className={styles.trustIcon}>
                      <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <h3 className={styles.trustTitle}>{item.title}</h3>
                    <p className={styles.trustText}>{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.faq}`} id="faq" aria-labelledby="faq-title">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionKicker}>Preguntas frecuentes</div>
              <h2 id="faq-title" className={styles.sectionTitle}>
                Resuelve tus dudas
              </h2>
            </div>
            <div className={styles.faqList}>
              {faqs.map((faq) => (
                <details key={faq.question} className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>{faq.question}</summary>
                  <p className={styles.faqAnswer}>
                    <BrandIntro text={faq.answer} />
                  </p>
                </details>
              ))}
            </div>
            <div className={styles.faqCta}>
              <p className={styles.faqCtaText}>
                ¿Quieres conocernos o trabajar con nosotros? Escríbenos y te respondemos.
              </p>
              <div className={styles.faqCtaActions}>
                <a
                  className={`${styles.button} ${styles.buttonBlue}`}
                  href="https://www.facebook.com/people/0noxtackore/61567098773222/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FacebookIcon />
                  Facebook
                </a>
                <a
                  className={`${styles.button} ${styles.buttonOutline}`}
                  href="https://www.instagram.com/0noxtackore.dev/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <InstagramIcon />
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.social} aria-labelledby="social-title">
          <h2 id="social-title" className={styles.socialTitle}>
            Síguenos
          </h2>
          <div className={styles.socialLinks}>
            <a
              className={styles.socialLink}
              href="https://www.facebook.com/people/0noxtackore/61567098773222/"
              target="_blank"
              rel="noreferrer"
            >
              <FacebookIcon />
              Facebook
            </a>
            <a
              className={styles.socialLink}
              href="https://www.instagram.com/0noxtackore.dev/"
              target="_blank"
              rel="noreferrer"
            >
              <InstagramIcon />
              Instagram
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
