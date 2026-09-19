/**
 * Central identity / branding configuration.
 *
 * All personal data (name, alias, contact info, social profiles, resume files)
 * is read from environment variables so this project can be reused as a
 * template without editing component source. See `.env.example` for the full
 * list. Fallbacks are intentionally generic placeholders.
 */

const env = import.meta.env;

/** Brand name used across UI, metadata and structured data. */
export const BRAND_NAME = (env.VITE_BRAND_NAME as string) || "FIQTOR";

/** Owner's full name. */
export const OWNER_NAME = (env.VITE_OWNER_NAME as string) || "Your Name";

/** Owner's online alias / handle (without the leading @). */
export const OWNER_ALIAS = (env.VITE_OWNER_ALIAS as string) || BRAND_NAME;

/** Job title / role. */
export const JOB_TITLE = (env.VITE_OWNER_JOB_TITLE as string) || "Software Engineer";

/** Short headline / tagline used in metadata. */
export const HEADLINE =
  (env.VITE_OWNER_HEADLINE as string) ||
  "An engineer building full stack web applications, AI automation, and business systems.";

/** Years of professional experience (number). */
export const YEARS_OF_EXPERIENCE = Number(env.VITE_OWNER_YEARS_EXPERIENCE) || 0;

/** Country of origin / operation. */
export const COUNTRY = (env.VITE_OWNER_COUNTRY as string) || "Indonesia";

/** ISO country code (e.g. "ID"). */
export const COUNTRY_CODE = (env.VITE_OWNER_COUNTRY_CODE as string) || "ID";

/** Spoken languages (comma separated in env, array here). */
export const LANGUAGES = ((env.VITE_OWNER_LANGUAGES as string) || "English")
  .split(",")
  .map((lang) => lang.trim())
  .filter(Boolean);

/** Public contact email address. */
export const CONTACT_EMAIL = (env.VITE_CONTACT_EMAIL as string) || "contact@example.com";

/** Secondary / business email address. */
export const BUSINESS_EMAIL = (env.VITE_CONTACT_BUSINESS_EMAIL as string) || CONTACT_EMAIL;

/** Public contact phone number (E.164 format recommended). */
export const CONTACT_PHONE = (env.VITE_CONTACT_PHONE as string) || "";

/** WhatsApp number in international format without "+" (for wa.me links). */
export const WHATSAPP_NUMBER = (env.VITE_CONTACT_WHATSAPP as string) || "";

/** X / Twitter handle (with leading @). */
export const TWITTER_HANDLE = (env.VITE_TWITTER_HANDLE as string) || `@${OWNER_ALIAS}`;

/** Optional Google Analytics measurement ID (e.g. "G-XXXXXXXXXX"). */
export const GA_MEASUREMENT_ID = (env.VITE_GA_MEASUREMENT_ID as string) || "";

/** Social profile URLs, overridable individually via env. */
export const SOCIAL_LINKS = {
  instagram: (env.VITE_SOCIAL_INSTAGRAM as string) || "",
  tiktok: (env.VITE_SOCIAL_TIKTOK as string) || "",
  youtube: (env.VITE_SOCIAL_YOUTUBE as string) || "",
  linkedin: (env.VITE_SOCIAL_LINKEDIN as string) || "",
  github: (env.VITE_SOCIAL_GITHUB as string) || "",
  threads: (env.VITE_SOCIAL_THREADS as string) || "",
};

/** Resume PDF paths (served from /public). */
export const RESUME = {
  creativeEn: (env.VITE_RESUME_CREATIVE_EN as string) || "/pdf/creative-resume-en.pdf",
  creativeId: (env.VITE_RESUME_CREATIVE_ID as string) || "/pdf/creative-resume-id.pdf",
  atsEn: (env.VITE_RESUME_ATS_EN as string) || "/pdf/resume-en.pdf",
  atsId: (env.VITE_RESUME_ATS_ID as string) || "/pdf/resume-id.pdf",
};

/** Optional portrait image path (served from /public). */
export const PORTRAIT_IMAGE = (env.VITE_PORTRAIT_IMAGE as string) || "/img/hero.png";

/** Optional company / business brand details (for services & linktree). */
export const COMPANY = {
  name: (env.VITE_COMPANY_NAME as string) || "IARTY",
  url: (env.VITE_COMPANY_URL as string) || "",
  aiUrl: (env.VITE_COMPANY_AI_URL as string) || "",
  educationUrl: (env.VITE_COMPANY_EDUCATION_URL as string) || "",
  marketplaceUrl: (env.VITE_COMPANY_MARKETPLACE_URL as string) || "",
  templatesUrl: (env.VITE_COMPANY_TEMPLATES_URL as string) || "",
  image: (env.VITE_COMPANY_IMAGE as string) || "/img/iarty.webp",
};

/** Build a wa.me link from the configured WhatsApp number. */
export const whatsappUrl = (message?: string): string => {
  const base = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

/** Build a mailto: link for the configured contact email. */
export const mailtoUrl = (email: string = CONTACT_EMAIL): string => `mailto:${email}`;
