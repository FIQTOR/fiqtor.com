/**
 * Identity / branding — the single source of truth for who the site is about.
 *
 * Values are mirrored from the previous frontend's `src/config/Identity.ts`.
 *
 * This module is intentionally PURE (no `import.meta.env`) so it can also be
 * imported from `vite.config.ts` (which generates the <head>, sitemap.xml and
 * robots.txt at build time).
 */

/**
 * The name used everywhere in the UI, metadata and navigation is simply
 * "FIQTOR". The legal / real name is intentionally NOT used as a display name;
 * it only appears in the About section ("previously known as …"), inside the
 * résumé PDFs, and — for machine-readable identity only — in structured data.
 */
export const BRAND_NAME = 'FIQTOR';

/** Public display name. This is the name shown to visitors. */
export const OWNER_NAME = 'FIQTOR';

/** Legal name. Rendered ONLY in the About section and in structured data. */
export const LEGAL_NAME = 'Taufiiqul Hakim';

/** Owner's online alias / handle (without the leading @). */
export const OWNER_ALIAS = 'FIQTOR';

/** Job title / role. */
export const JOB_TITLE = 'AI & Software Engineer';

/** Short headline / tagline used in metadata. */
export const HEADLINE =
  'FIQTOR is an AI and software engineer from Indonesia building full stack web applications, AI automation, and business systems.';

/** Years of professional experience. */
export const YEARS_OF_EXPERIENCE = 5;

/**
 * Number of satisfied clients, shown in the hero quick-facts row.
 * Rounded down on purpose: the hero renders it as `${CLIENTS_SATISFIED}+`.
 */
export const CLIENTS_SATISFIED = 100;

/** Country of origin / operation. */
export const COUNTRY = 'Indonesia';
export const COUNTRY_CODE = 'ID';

/** Spoken languages. */
export const LANGUAGES = ['English', 'Bahasa Indonesia'];

/** Founder of the company below — used for credentials and "known as". */
export const FOUNDER_OF = 'IARTY';

/** Public contact email. */
export const CONTACT_EMAIL = 'contact@fiqtor.com';
/** Secondary / business email. */
export const BUSINESS_EMAIL = 'business@fiqtor.com';

/** Public phone (E.164). */
export const CONTACT_PHONE = '+6281617262908';
/** WhatsApp number without the "+" (for wa.me links). */
export const WHATSAPP_NUMBER = '6281617262908';

/** X / Twitter handle. */
export const TWITTER_HANDLE = '@fiqtor';

/**
 * Canonical Google Analytics 4 measurement ID.
 *
 * This is the DEFAULT the site ships with. It is overridable per build by
 * setting `VITE_GA_ID` (see `.env.example`) — useful for staging or for
 * turning analytics off entirely without a code change — but it is no longer
 * inert: the value is injected into `<head>` by `src/config/Seo.ts` and loaded
 * by `src/lib/analytics.ts`. Set `VITE_GA_ID=` to an empty string to disable.
 */
export const GA_MEASUREMENT_ID = 'G-FTJ2LRGE5P';

/** Canonical site origin (no trailing slash). */
export const SITE_ORIGIN = 'https://fiqtor.com';

/** Social profile URLs. */
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/fiqtorr/',
  tiktok: 'https://www.tiktok.com/@fiqtor',
  youtube: 'https://www.youtube.com/@fiqtor',
  linkedin: 'https://www.linkedin.com/in/fiqtor',
  github: 'https://github.com/fiqtor',
  threads: 'https://www.threads.net/@fiqtorr',
} as const;

/** GitHub username (public — tokens stay on the backend). */
export const GITHUB_USERNAME = 'FIQTOR';

/** WakaTime username (public — the API key stays on the backend). */
export const WAKATIME_USERNAME = 'FIQTOR';

/** Timezone used by the footer clock. */
export const TIMEZONE = 'Asia/Jakarta';
export const TIMEZONE_LABEL = 'WIB';

/** Resume PDF paths (served from /public). */
export const RESUME = {
  creativeEn: '/pdf/Taufiiqul_Hakim-Creative_Resume-en.pdf',
  creativeId: '/pdf/Taufiiqul_Hakim-Creative_Resume-id.pdf',
  atsEn: '/pdf/Taufiiqul_Hakim-Resume-en.pdf',
  atsId: '/pdf/Taufiiqul_Hakim-Resume-id.pdf',
} as const;

/** Portrait image path. */
export const PORTRAIT_IMAGE = '/icon.webp';

/** Company / business brand details. */
export const COMPANY = {
  name: 'IARTY',
  url: 'https://iarty.biz.id',
  aiUrl: 'https://ai.iarty.biz.id',
  educationUrl: 'https://education.iarty.biz.id',
  marketplaceUrl: 'https://marketplace.iarty.biz.id',
  templatesUrl: 'https://iarty.biz.id/templates',
  image: '/img/iarty.webp',
} as const;

/** Build a wa.me link for the configured number. */
export const whatsappUrl = (message?: string): string => {
  const base = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

/** Build a mailto: link. */
export const mailtoUrl = (email: string = CONTACT_EMAIL): string => `mailto:${email}`;
