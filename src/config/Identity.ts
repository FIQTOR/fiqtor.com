/**
 * Central identity / branding configuration.
 *
 * ⚠️ This is STATIC, CODE-BASED configuration (NOT environment variables).
 *    Personal data lives here so it is versioned and reusable without env
 *    juggling. Edit the values below and rebuild.
 *
 * This module is intentionally PURE (no `import.meta.env`) so it can be
 * imported from BOTH the browser app AND the Vite Node build config
 * (vite.config.ts) that generates the <head>, sitemap.xml and robots.txt.
 */

/** Brand name used across UI, metadata and structured data. */
export const BRAND_NAME = "FIQTOR";

/** Owner's full name. */
export const OWNER_NAME = "Taufiiqul Hakim";

/** Owner's online alias / handle (without the leading @). */
export const OWNER_ALIAS = "FIQTOR";

/** Job title / role. */
export const JOB_TITLE = "AI & Software Engineer";

/** Short headline / tagline used in metadata. */
export const HEADLINE =
  "FIQTOR is an AI and software engineer from Indonesia building full stack web applications, AI automation, and business systems.";

/** Years of professional experience (number). */
export const YEARS_OF_EXPERIENCE = 5;

/** Country of origin / operation. */
export const COUNTRY = "Indonesia";

/** ISO country code (e.g. "ID"). */
export const COUNTRY_CODE = "ID";

/** Spoken languages. */
export const LANGUAGES = ["English", "Bahasa Indonesia"];

/** Public contact email address. */
export const CONTACT_EMAIL = "contact@fiqtor.com";

/** Secondary / business email address. */
export const BUSINESS_EMAIL = "business@fiqtor.com";

/** Public contact phone number (E.164 format recommended). */
export const CONTACT_PHONE = "+6281617262908";

/** WhatsApp number in international format without "+" (for wa.me links). */
export const WHATSAPP_NUMBER = "6281617262908";

/** X / Twitter handle (with leading @). */
export const TWITTER_HANDLE = "@fiqtor";

/** Optional Google Analytics measurement ID (e.g. "G-XXXXXXXXXX"). Empty disables it. */
export const GA_MEASUREMENT_ID = "G-FTJ2LRGE5P";

/** Canonical site origin (no trailing slash). Used for canonical/OG/JSON-LD URLs. */
export const SITE_ORIGIN = "https://fiqtor.com";

/** Social profile URLs. */
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/fiqtorr/",
  tiktok: "https://www.tiktok.com/@fiqtor",
  youtube: "https://www.youtube.com/@fiqtor",
  linkedin: "https://www.linkedin.com/in/fiqtor",
  github: "https://github.com/fiqtor",
  threads: "https://www.threads.net/@fiqtorr",
};

/** Resume PDF paths (served from /public). */
export const RESUME = {
  creativeEn: "/pdf/Taufiiqul_Hakim-Creative_Resume-en.pdf",
  creativeId: "/pdf/Taufiiqul_Hakim-Creative_Resume-id.pdf",
  atsEn: "/pdf/Taufiiqul_Hakim-Resume-en.pdf",
  atsId: "/pdf/Taufiiqul_Hakim-Resume-id.pdf",
};

/** Portrait image path (served from /public). */
export const PORTRAIT_IMAGE = "/icon.webp";

/** Company / business brand details (for services & linktree). */
export const COMPANY = {
  name: "IARTY",
  url: "https://iarty.biz.id",
  aiUrl: "https://ai.iarty.biz.id",
  educationUrl: "https://education.iarty.biz.id",
  marketplaceUrl: "https://marketplace.iarty.biz.id",
  templatesUrl: "https://iarty.biz.id/templates",
  image: "/img/iarty.webp",
};

/** Build a wa.me link from the configured WhatsApp number. */
export const whatsappUrl = (message?: string): string => {
  const base = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

/** Build a mailto: link for the configured contact email. */
export const mailtoUrl = (email: string = CONTACT_EMAIL): string => `mailto:${email}`;
