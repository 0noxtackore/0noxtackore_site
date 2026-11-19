"use client";

import { useEffect, useState } from "react";

import type { HeroSlide } from "./data";
import styles from "./site.module.css";

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <>
      {slides.map((slide, index) => (
        <div
          key={slide.desktop}
          className={`${styles.slide} ${index === active ? styles.slideActive : ""}`}
          aria-hidden={index !== active}
        >
          <picture>
            <source media="(max-width: 860px)" srcSet={slide.mobile} type="image/webp" />
            <img
              src={slide.desktop}
              alt={slide.alt}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "low"}
              decoding="async"
            />
          </picture>
        </div>
      ))}

      {slides.length > 1 && (
        <div className={styles.slideDots} role="tablist" aria-label="Imágenes del hero">
          {slides.map((slide, index) => (
            <button
              key={slide.desktop}
              type="button"
              role="tab"
              aria-label={`Ver imagen ${index + 1}`}
              aria-selected={index === active}
              className={`${styles.slideDot} ${index === active ? styles.slideDotActive : ""}`}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      )}
    </>
  );
}
