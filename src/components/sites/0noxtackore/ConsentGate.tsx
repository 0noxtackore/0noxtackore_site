"use client";

import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";

import { gaMeasurementId } from "./data";

const CONSENT_KEY = "0noxtackore_cookie_consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function setGoogleConsent(granted: boolean) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push([
    "consent",
    "update",
    {
      ad_storage: granted ? "granted" : "denied",
      analytics_storage: granted ? "granted" : "denied",
      ad_user_data: granted ? "granted" : "denied",
      ad_personalization: granted ? "granted" : "denied",
      functionality: granted ? "granted" : "denied",
    },
  ]);
}

function loadTrackingScripts() {
  if (document.getElementById("gtm-consent")) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args); };
  window.gtag("js", new Date());
  window.dataLayer.push([
    "consent",
    "default",
    {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality: "denied",
    },
  ]);
  setGoogleConsent(true);
  window.gtag("config", gaMeasurementId, { anonymize_ip: true });

  const gtm = document.createElement("script");
  gtm.id = "gtm-consent";
  gtm.async = true;
  gtm.src = "https://www.googletagmanager.com/gtm.js?id=GTM-WSQ2DVNH";
  document.head.appendChild(gtm);

  const ga = document.createElement("script");
  ga.id = "ga-consent";
  ga.async = true;
  ga.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
  document.head.appendChild(ga);
}

export function ConsentGate() {
  const [choice, setChoice] = useState<"granted" | "denied" | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    setChoice(saved === "granted" || saved === "denied" ? saved : null);
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!checked || choice !== "granted") return;
    loadTrackingScripts();
  }, [checked, choice]);

  function decide(value: "granted" | "denied") {
    window.localStorage.setItem(CONSENT_KEY, value);
    if (value === "granted") setGoogleConsent(true);
    setChoice(value);
  }

  if (!checked) return null;

  if (choice === "granted") {
    return (
      <>
        <Analytics />
        <SpeedInsights />
      </>
    );
  }

  if (choice === "denied") return null;

  const privacyHref = window.location.pathname.startsWith("/en") ? "/en/privacy" : "/es/privacidad";

  return (
    <div
      role="dialog"
      aria-label="Preferencias de cookies"
      style={{
        position: "fixed",
        zIndex: 1200,
        left: 16,
        right: 16,
        bottom: 16,
        maxWidth: 720,
        margin: "0 auto",
        background: "#0e1726",
        color: "#fff",
        border: "1px solid #2a3a50",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
      }}
    >
      <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: "22px" }}>
        Usamos cookies de analítica para entender cómo se usa el sitio. Puedes aceptarlas o rechazarlas.
        Lee la <Link href={privacyHref} style={{ color: "#7ec8ff", textDecoration: "underline" }}>política de privacidad</Link>.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => decide("granted")}
          style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #2563eb", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer" }}
        >
          Aceptar
        </button>
        <button
          type="button"
          onClick={() => decide("denied")}
          style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #64748b", background: "transparent", color: "#fff", fontWeight: 600, cursor: "pointer" }}
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}
