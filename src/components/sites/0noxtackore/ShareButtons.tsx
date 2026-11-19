"use client";

import { useEffect, useState } from "react";
import { Check, Link2 } from "lucide-react";

import { siteUrl } from "./data";
import styles from "./site.module.css";

const defaultText =
  "Construimos tecnología con propósito. Descubre qué hacemos en 0NOXTACKORE.";

type ShareButtonsProps = {
  url?: string;
  text?: string;
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.48s1.06 2.88 1.21 3.07c.15.2 2.08 3.18 5.05 4.46.71.31 1.26.5 1.69.63.71.23 1.35.19 1.86.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.5 2 2.02 6.48 2.02 12c0 1.77.46 3.5 1.34 5.02L2 22l5.14-1.35A9.94 9.94 0 0 0 12.04 22c5.52 0 10-4.48 10-10S17.56 2 12.04 2zm0 18.16c-1.63 0-3.22-.44-4.61-1.27l-.33-.2-3.05.8.81-2.98-.22-.31A8.16 8.16 0 0 1 3.88 12c0-4.5 3.66-8.16 8.16-8.16 2.18 0 4.23.85 5.77 2.39a8.13 8.13 0 0 1 2.39 5.77c0 4.5-3.66 8.16-8.16 8.16z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.41L6.48 22H3.36l7.24-8.28L2.8 2h6.4l4.43 5.86L18.9 2zm-1.1 18h1.73L7.36 3.89H5.5L17.8 20z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M20.45 2H3.55C2.69 2 2 2.69 2 3.55v16.9c0 .86.69 1.55 1.55 1.55h16.9c.86 0 1.55-.69 1.55-1.55V3.55c0-.86-.69-1.55-1.55-1.55zM8.34 18.34H5.67V9.9h2.67v8.44zM7.01 8.78a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1zm11.33 9.56h-2.67v-4.1c0-.98-.02-2.24-1.37-2.24-1.37 0-1.58 1.07-1.58 2.17v4.17H10.05V9.9h2.56v1.16h.04c.36-.68 1.23-1.39 2.53-1.39 2.7 0 3.2 1.78 3.2 4.09v4.58z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

export function ShareButtons({ url = siteUrl, text = defaultText }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      Icon: WhatsAppIcon,
      className: "shareWhatsapp",
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      Icon: XIcon,
      className: "shareX",
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: LinkedInIcon,
      className: "shareLinkedin",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: FacebookIcon,
      className: "shareFacebook",
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={styles.shareButtons}>
      {links.map(({ label, href, Icon, className }) => (
        <a
          key={label}
          className={`${styles.shareButton} ${styles[className]}`}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Compartir en ${label}`}
        >
          <Icon />
          <span>{label}</span>
        </a>
      ))}
      <button
        type="button"
        className={`${styles.shareButton} ${styles.shareCopy}`}
        onClick={copyLink}
        aria-label="Copiar enlace"
        aria-live="polite"
      >
        {copied ? <Check size={18} aria-hidden="true" /> : <Link2 size={18} aria-hidden="true" />}
        <span>{copied ? "¡Enlace copiado!" : "Copiar enlace"}</span>
      </button>
    </div>
  );
}
