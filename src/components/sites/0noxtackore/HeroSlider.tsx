"use client";

import { useEffect, useState } from "react";

import type { HeroSlide } from "./data";
import styles from "./site.module.css";

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(
    () => new Set([0, slides.length > 1 ? 1 : 0]),
  );
  const [shown, setShown] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => {
        const nextActive = (current + 1) % slides.length;
        setLoaded((prev) => {
          if (prev.has(nextActive) && prev.has((nextActive + 1) % slides.length)) {
            return prev;
          }
          const next = new Set(prev);
          next.add(nextActive);
          next.add((nextActive + 1) % slides.length);
          return next;
        });
        return nextActive;
      });
    }, 5500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const first = slides[0];

  return (
    <>
      {first && (
        <>
          <link
            rel="preload"
            as="image"
            href={first.desktop}
            media="(min-width: 861px)"
            fetchPriority="high"
          />
          <link
            rel="preload"
            as="image"
            href={first.mobile}
            media="(max-width: 860px)"
            fetchPriority="high"
          />
        </>
      )}
      {slides.map((slide, index) => {
        const isActive = index === active;
        const shouldLoad = loaded.has(index);
        const isShown = shown.has(index);
        return (
          <div
            key={slide.desktop}
            className={`${styles.slide} ${isActive ? styles.slideActive : ""}`}
            aria-hidden={!isActive}
            style={{
              backgroundImage: `url(${slide.blur})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {shouldLoad && (
              <picture>
                <source
                  media="(max-width: 860px)"
                  srcSet={slide.mobile}
                  type="image/webp"
                />
                <img
                  src={slide.desktop}
                  alt={slide.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  onLoad={() =>
                    setShown((prev) => {
                      if (prev.has(index)) return prev;
                      const next = new Set(prev);
                      next.add(index);
                      return next;
                    })
                  }
                  style={{
                    opacity: isShown ? 1 : 0,
                    transition: "opacity 0.6s ease, transform 6.5s linear",
                  }}
                />
              </picture>
            )}
          </div>
        );
      })}

      {slides.length > 1 && (
        <div
          className={styles.slideDots}
          role="tablist"
          aria-label="Imágenes del hero"
        >
          {slides.map((slide, index) => (
            <button
              key={slide.desktop}
              type="button"
              role="tab"
              aria-label={`Ver imagen ${index + 1}`}
              aria-selected={index === active}
              className={`${styles.slideDot} ${index === active ? styles.slideDotActive : ""}`}
              onClick={() => {
                setLoaded((prev) => {
                  const next = new Set(prev);
                  next.add(index);
                  next.add((index + 1) % slides.length);
                  return next;
                });
                setActive(index);
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
