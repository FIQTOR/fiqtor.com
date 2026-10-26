/* =====================================================================
   SITE DATA — one place to edit content.
   ---------------------------------------------------------------------
   Every screen (home sections, catalogues, career, contact, linktree)
   reads from `S` below. `projects.ts` and `certificates.ts` keep the
   original bilingual content; `catalog.ts` normalizes it into the flat,
   language-aware shapes used by the UI.
   ===================================================================== */

import {
  BRAND_NAME,
  OWNER_NAME,
  LEGAL_NAME,
  OWNER_ALIAS,
  JOB_TITLE,
  HEADLINE,
  YEARS_OF_EXPERIENCE,
  CLIENTS_SATISFIED,
  COUNTRY,
  CONTACT_EMAIL,
  BUSINESS_EMAIL,
  WHATSAPP_NUMBER,
  SOCIAL_LINKS,
  GITHUB_USERNAME,
  WAKATIME_USERNAME,
  TIMEZONE,
  TIMEZONE_LABEL,
  RESUME,
  COMPANY,
  PORTRAIT_IMAGE,
} from '../config/Identity';
import { rawProjects } from './projects';
import { rawCertificates } from './certificates';
import { CERTIFICATE_DESCRIPTIONS } from './certificatesExtra';
import { CERT_GROUPS, FEATURED_CERTS, MERGED_CERT_GROUPS } from './certGroups';
import { galleryLabel } from './galleryLabels';
import type { IconName } from '../lib/utils';

export type Language = 'en' | 'id';
export type LocalizedText = Record<Language, string>;

/**
 * How many testimonials are visible on the homepage *before* the rail is
 * scrolled. It is also the JSON-LD `reviewCount`: Google's review-snippet
 * policy requires every rated item to be visible on the page, so this number
 * and the slice in the homepage section must stay the same value — hence one
 * exported constant instead of two literals.
 */
export const HOME_REVIEW_COUNT = 6;

/* ---------------------------------------------------------------------
   Raw project types (as authored in projects.ts)
   --------------------------------------------------------------------- */

export type ProjectCategory =
  | 'AI & Automation'
  | 'Web App'
  | 'Business System'
  | 'E-Commerce'
  | 'Landing Page'
  | 'Template'
  | 'Creative';

export interface RawProject {
  title: LocalizedText;
  category: ProjectCategory;
  description: LocalizedText;
  urlDirect?: string;
  srcImage: string;
  images?: string[];
  tags?: Record<Language, string[]>;
  /** Tech names (was: icon components in the old frontend). */
  icons: string[];
  best?: boolean;
}

/* ---------------------------------------------------------------------
   Normalized types used by the UI
   --------------------------------------------------------------------- */

export interface GalleryItem {
  src: string;
  caption: LocalizedText;
}

export interface Project {
  id: string;
  title: LocalizedText;
  year: string;
  role: LocalizedText;
  desc: LocalizedText;
  about?: LocalizedText;
  tags: LocalizedText[];
  /** Flat list, language independent (tech names). */
  skills: string[];
  url?: string;
  thumb: string;
  gallery: GalleryItem[];
  category: ProjectCategory;
  featured: boolean;
}

export interface Cert {
  id: string;
  name: string;
  issuer: LocalizedText;
  date: string;
  url?: string;
  img: string;
  secondary?: { src: string; label: LocalizedText };
  tags: LocalizedText[];
  desc: LocalizedText;
  skills: string[];
  academic: boolean;
  featured: boolean;
  /** Issuer can be checked online (verification link or official body). */
  verified: boolean;
  /** Number of underlying credentials — >1 for merged quiz bundles. */
  count: number;
  /** Extra detail rows of a merged entry (topic → date). */
  details?: { label: string; date: string }[];
  /** Short kind label used on the card badge ("Competition", "Course", …). */
  kind: LocalizedText;
}

export interface CareerItem {
  period: LocalizedText;
  role: LocalizedText;
  org: string;
  location: LocalizedText;
  desc: LocalizedText;
  website?: string;
  logo: string;
  points: LocalizedText[];
  /**
   * Machine-readable dates. `period` is what a visitor reads; these two are
   * what the timeline is SORTED by, so the list can never drift out of
   * chronological order when an entry is edited or inserted.
   * `end: null` marks an ongoing role.
   */
  start: string;
  end: string | null;
}

export interface LinkItem {
  label: LocalizedText;
  note: LocalizedText;
  url: string;
  icon: IconName;
  featured?: boolean;
}

/**
 * A destination shown as a round icon in the link-hub's social row.
 *
 * This used to be derived by scraping `links` for matching icon names, which
 * meant a listed-but-unmatched icon (`linkedin`) vanished silently and every
 * social had to be duplicated as a full row too. Driving the row from its own
 * list makes one entry = one button, with no hidden cross-references.
 */
export interface SocialLink {
  icon: IconName;
  label: LocalizedText;
  url: string;
  /** `false` for in-site routes so the icon row respects the router. */
  external: boolean;
}

export interface Service {
  /** Stable anchor/key: `#pricing-<slug>`. */
  slug: string;
  title: LocalizedText;
  desc: LocalizedText;
  /** Outcome-focused line: the benefits a client feels, not the tech used. */
  meta: LocalizedText;
  /** Who this service is for — lets a visitor recognise themselves. */
  fitsFor: LocalizedText;
  /**
   * Starting price label. Mirrors IARTY's published packages; deliberately a
   * string (not a number) so "Sesuai lingkup" can sit beside real figures.
   */
  from: LocalizedText;
}

/**
 * A real client quote, collected on iarty.biz.id. Only testimonials that have
 * a photo and a named business are listed: an unattributed quote is worse than
 * none, and the `img` is what makes the card feel like a person.
 */
export interface Testimonial {
  name: string;
  role: LocalizedText;
  quote: LocalizedText;
  /** Public path, e.g. /img/testimonials/kedai-nagata.webp */
  img: string;
}

export interface Step {
  title: LocalizedText;
  desc: LocalizedText;
}

export interface Faq {
  q: LocalizedText;
  a: LocalizedText;
}

export interface LinktreeHub {
  label: LocalizedText;
  domain: string;
  href: string;
  image: string;
}

export type CatalogItem = Project | Cert;

/* ---------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------- */

const slug = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

const toAbsoluteAssetPath = (src: string): string =>
  src.startsWith('/') || /^[a-z]+:\/\//i.test(src) ? src : `/${src}`;

/** Split "Model - Subtitle" into the two halves. */
const splitTitle = (title: string): { name: string; subtitle?: string } => {
  const m = title.match(/^(.+?)\s+-\s+(.+)$/);
  if (!m) return { name: title };
  return { name: m[1].trim(), subtitle: m[2].trim() };
};

/** Tidy file names: `seameo-qitep-in-science-pkl-taufiiqul-hakim` → "Seameo Qitep…" */
const prettyFileName = (src: string): string =>
  (src.split('/').pop() ?? src)
    .replace(/\.\w+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Tech names → categories used by the "role" line on cards. Keeps the card
 * subtitle factual without inventing marketing copy per project.
 */
const roleFor = (p: RawProject): LocalizedText => {
  const primary = p.icons[0] ?? 'Web';
  const extra = p.icons.slice(1, 3);
  const stack = [primary, ...extra].join(' · ');
  const kind =
    p.category === 'Creative'
      ? { en: 'Creative build', id: 'Karya kreatif' }
      : p.category === 'Template'
        ? { en: 'Template', id: 'Template' }
        : p.category === 'Landing Page'
          ? { en: 'Landing page', id: 'Landing page' }
          : p.category === 'E-Commerce'
            ? { en: 'E-commerce', id: 'E-commerce' }
            : p.category === 'Business System'
              ? { en: 'Business system', id: 'Sistem bisnis' }
              : p.category === 'AI & Automation'
                ? { en: 'AI & automation', id: 'AI & otomatisasi' }
                : { en: 'Web app', id: 'Aplikasi web' };
  return { en: `${kind.en} · ${stack}`, id: `${kind.id} · ${stack}` };
};

/**
 * Preferred order for the homepage's flagship grid.
 *
 * ⚠️ CURRENTLY INERT. These are short labels, but `Project.id` is a slug of the
 * full title (`jakarta-transit-live-public-transport-tracking`), so every
 * `indexOf` below returns -1 and the sort degenerates to the authoring order
 * in `projects.ts`. That means the homepage's "flagship" grid has never been
 * ranked. Fixing it means replacing these with the real slugs — a visible
 * content change, so it is left for a deliberate decision rather than bundled
 * in silently.
 */
const BEST_ORDER = [
  'jakarta-transit',
  'iarty-ecosystem',
  'ai-marketplace',
  'zantova-app',
  'whatsapp-automation',
];

/* ---------------------------------------------------------------------
   Normalize projects
   --------------------------------------------------------------------- */

const projects: Project[] = rawProjects.map((p) => {
  const thumb = toAbsoluteAssetPath(p.srcImage);
  const images = (p.images ?? []).map(toAbsoluteAssetPath);
  const gallery: GalleryItem[] = (images.length ? images : [thumb]).map((src) => ({
    src,
    caption: { en: galleryLabel(src, 'en'), id: galleryLabel(src, 'id') },
  }));
  return {
    id: slug(p.title.en),
    title: p.title,
    year: '2025',
    role: roleFor(p),
    desc: p.description,
    tags: (p.tags?.en ?? []).map((t, k) => ({ en: t, id: p.tags?.id?.[k] ?? t })),
    skills: p.icons,
    url: p.urlDirect,
    thumb,
    gallery,
    category: p.category,
    featured: p.best === true,
  };
});

// Order the homepage's flagship grid: the few best-known builds first.
const featured = projects
  .filter((p) => p.featured)
  .toSorted((a, b) => {
    const ai = BEST_ORDER.indexOf(a.id);
    const bi = BEST_ORDER.indexOf(b.id);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

/* ---------------------------------------------------------------------
   Normalize certificates
   --------------------------------------------------------------------- */

/** Most specific issuer first; the first match wins. */
const ISSUER_RULES: Array<[RegExp, string]> = [
  [/BNSP/i, 'BNSP'],
  [/SEAMEO|SEAQIS/i, 'SEAMEO QITEP in Science'],
  [/HMJTI POLIJE/i, 'HMJTI Politeknik Negeri Jember'],
  [/PENS|Elektronika Negeri Surabaya/i, 'Politeknik Elektronika Negeri Surabaya'],
  [/GDG|Google Developer Groups/i, 'Google Developer Groups'],
  [/HMIF UPN/i, 'HMIF UPN "Veteran" East Java'],
  [/freeCodeCamp/i, 'freeCodeCamp'],
  [/Dicoding/i, 'Dicoding Indonesia'],
  [/Dilesin/i, 'Dilesin.id'],
  [/GEMA Foundation/i, 'GEMA Foundation'],
  [/Future Entrepreneur Summit/i, 'Future Entrepreneur Summit'],
  [/W3Docs/i, 'W3Docs'],
  [/LKS SMK/i, 'LKS SMK (Skills Competition)'],
  [/Airofest|Airnology/i, 'Universitas Airlangga'],
];

const issuerFor = (title: string, tags: string[], subtitle?: string): string =>
  ISSUER_RULES.find(([re]) => re.test(title))?.[1] ??
  tags.find((t) => /[A-Z]{2,}/.test(t) && !/Development|Score|Quiz|Basic/i.test(t)) ??
  subtitle ??
  BRAND_NAME;

/**
 * Which kind of credential is this? Drives the card badge.
 * Derived from the group taxonomy (source of truth) with a title fallback for
 * any certificate that is not grouped yet.
 */
const kindFor = (id: string, title: string, merged: boolean): LocalizedText => {
  if (merged) return { en: 'Quiz bundle', id: 'Paket kuis' };
  const group = CERT_GROUPS.find((g) => g.ids.includes(id));
  switch (group?.id) {
    case 'competition':
      return { en: 'Competition', id: 'Kompetisi' };
    case 'national':
      return /internship|praktik kerja/i.test(title)
        ? { en: 'Internship', id: 'Magang' }
        : { en: 'National certification', id: 'Sertifikasi nasional' };
    case 'course':
      return { en: 'Course', id: 'Kursus' };
    case 'language':
      return { en: 'Language & soft skills', id: 'Bahasa & soft skill' };
    case 'event':
      return /webinar/i.test(title) ? { en: 'Webinar', id: 'Webinar' } : { en: 'Event', id: 'Event' };
    default:
      return /competition|champion|lks|airofest/i.test(title)
        ? { en: 'Competition', id: 'Kompetisi' }
        : { en: 'Certificate', id: 'Sertifikat' };
  }
};

/** Issuers whose certificate pages can be opened and re-checked by anyone. */
const VERIFIABLE_ISSUERS = new Set([
  'freeCodeCamp',
  'Dicoding Indonesia',
  'W3Docs',
  'Dilesin.id',
  'BNSP',
  'SEAMEO QITEP in Science',
]);

const baseCerts: Cert[] = rawCertificates.map((c) => {
  const { name, subtitle } = splitTitle(c.title);
  const tags = c.tags ?? [];
  const id = slug(c.title);
  const issuerName = issuerFor(c.title, tags, subtitle);
  return {
    id,
    name,
    issuer: { en: issuerName, id: issuerName },
    date: c.published,
    url: c.urlDirect,
    img: toAbsoluteAssetPath(c.srcImage),
    secondary: c.srcImageSecondary
      ? {
          src: toAbsoluteAssetPath(c.srcImageSecondary),
          label: { en: c.secondaryLabel ?? 'Result sheet', id: c.secondaryLabel ?? 'Lembar hasil' },
        }
      : undefined,
    tags: tags.map((t) => ({ en: t, id: t })),
    desc: {
      en:
        CERTIFICATE_DESCRIPTIONS[c.title] ??
        `${name}${subtitle ? ' — ' + subtitle : ''}. Issued ${c.published}. ${tags.length ? 'Covers: ' + tags.join(', ') + '.' : ''}`,
      id:
        CERTIFICATE_DESCRIPTIONS[c.title] ??
        `${name}${subtitle ? ' — ' + subtitle : ''}. Diterbitkan ${c.published}. ${tags.length ? 'Mencakup: ' + tags.join(', ') + '.' : ''}`,
    },
    skills: tags.length ? tags : [prettyFileName(c.srcImage)],
    academic: c.thisAcademic,
    featured: c.best === true,
    verified: Boolean(c.urlDirect) || VERIFIABLE_ISSUERS.has(issuerName),
    count: 1,
    kind: kindFor(id, c.title, false),
  };
});

const byId = new Map(baseCerts.map((c) => [c.id, c]));

/** Collapse repeated quiz completions into one card ("W3Docs — 6 quizzes"). */
const mergedCerts: Cert[] = MERGED_CERT_GROUPS.map((g): Cert | null => {
  const members = g.ids.map((id) => byId.get(id)).filter((c): c is Cert => Boolean(c));
  if (!members.length) return null;
  const topics = members.map((m) => ({ label: m.name.replace(/^W3Docs — /, ''), date: m.date }));
  const dates = members.map((m) => m.date);
  const first = members[0];
  const merged: Cert = {
    ...first,
    id: g.id,
    name: g.name,
    date: dates[0],
    url: undefined,
    img: first.img,
    secondary: undefined,
    tags: topics.map((t) => ({ en: t.label, id: t.label })),
    skills: topics.map((t) => t.label),
    count: members.length,
    details: topics,
    kind: kindFor(g.id, g.name, true),
    desc: {
      en: `Six separate W3Docs skill quizzes, each passed with a perfect score (100/100) covering HTML5, CSS3, JavaScript, PHP, TypeScript, and React. Grouped here because they test the same fundamentals — the individual certificates are still available in the detail view.`,
      id: `Enam kuis keterampilan W3Docs terpisah, semuanya lulus dengan skor sempurna (100/100) mencakup HTML5, CSS3, JavaScript, PHP, TypeScript, dan React. Digabung di sini karena menguji dasar yang sama — sertifikat aslinya tetap tersedia di tampilan detail.`,
    },
  };
  return merged;
}).filter((c): c is Cert => Boolean(c));

/** Final catalogue order: original order, with each merged bundle in place of its first member. */
const mergedByMember = new Map<string, Cert>();
mergedCerts.forEach((m) => {
  const group = MERGED_CERT_GROUPS.find((g) => g.id === m.id);
  group?.ids.forEach((id) => mergedByMember.set(id, m));
});
const certs: Cert[] = (() => {
  const out: Cert[] = [];
  for (const c of baseCerts) {
    const bundle = mergedByMember.get(c.id);
    if (bundle) {
      if (!out.includes(bundle)) out.push(bundle);
      continue;
    }
    out.push(c);
  }
  return out;
})();

/** Flagship certificates, in the curated order defined in certGroups.ts. */
const featuredCerts: Cert[] = (() => {
  const picked = FEATURED_CERTS.map((id) => certs.find((c) => c.id === id)).filter((c): c is Cert => Boolean(c));
  // Anything explicitly marked `best` but not in the curated list follows.
  const extra = certs.filter((c) => c.featured && !picked.includes(c));
  return [...picked, ...extra];
})();

/* ---------------------------------------------------------------------
   Career (ported from the previous frontend, trimmed with real highlights)
   --------------------------------------------------------------------- */

/**
 * Career entries, newest first.
 *
 * `period` is the label; `start`/`end` are the sort key. Sorting happens here
 * (not in the page) so the homepage, the Career page and any résumé view share
 * one order and can never disagree.
 *
 * Rule: ongoing roles (`end: null`) sort by start date like everything else,
 * because they are all still running. That keeps the most recently started
 * work at the top, which is what a visitor scanning the timeline expects.
 */
const careerRaw: CareerItem[] = [
  {
    period: { en: 'Mar 2025 — Present', id: 'Mar 2025 — Sekarang' },
    start: '2025-03',
    end: null,
    role: { en: 'Founder', id: 'Pendiri' },
    org: COMPANY.name,
    location: { en: 'Bekasi, Indonesia', id: 'Bekasi, Indonesia' },
    website: COMPANY.url,
    logo: COMPANY.image,
    desc: {
      en: 'Built and scaled the IARTY ecosystem across education, AI, digital products, and services — leading end-to-end business strategy, product development, marketing, and operations.',
      id: 'Membangun dan mengembangkan ekosistem IARTY di bidang pendidikan, AI, produk digital, dan layanan — memimpin strategi bisnis dari hulu ke hilir, pengembangan produk, pemasaran, dan operasional.',
    },
    points: [
      { en: 'Shipped the IARTY ecosystem: website, IARTY AI, education, and marketplace.', id: 'Merilis ekosistem IARTY: website, IARTY AI, education, dan marketplace.' },
      { en: 'Built AI-powered products and automation for real business workflows.', id: 'Membangun produk bertenaga AI dan otomasi untuk alur kerja bisnis nyata.' },
      { en: 'Grew a multi-platform presence (Instagram, TikTok, YouTube, Threads) with tech-focused content.', id: 'Menumbuhkan kehadiran multi-platform (Instagram, TikTok, YouTube, Threads) dengan konten bertema teknologi.' },
      { en: 'Produced educational content for academy.iarichty, simplifying complex tech and AI topics.', id: 'Memproduksi konten edukatif untuk academy.iarichty, menyederhanakan topik teknologi dan AI yang rumit.' },
    ],
  },
  {
    period: { en: 'Nov 2025 — Apr 2026', id: 'Nov 2025 — Apr 2026' },
    start: '2025-11',
    end: '2026-04',
    role: { en: 'Freelance Web Programming Trainer', id: 'Trainer Pemrograman Web Freelance' },
    org: 'Flashcom Indonesia',
    location: { en: 'Surabaya, Indonesia', id: 'Surabaya, Indonesia' },
    website: 'https://flashcomindonesia.com',
    logo: '/img/career/flashcom-indonesia.webp',
    desc: {
      en: 'Teaching and mentoring students in website development, covering both front-end and back-end fundamentals through hands-on projects.',
      id: 'Mengajar dan membimbing siswa dalam pengembangan website, mencakup dasar front-end dan back-end melalui proyek praktik.',
    },
    points: [
      { en: 'Taught front-end and back-end fundamentals to cohorts of learners.', id: 'Mengajar dasar front-end dan back-end kepada angkatan peserta.' },
      { en: 'Guided learners through hands-on projects that build portfolio-ready skills.', id: 'Membimbing peserta lewat proyek praktik yang membangun keterampilan siap kerja.' },
      { en: 'Prepared students for careers or freelance work in web development.', id: 'Menyiapkan peserta untuk karier atau kerja freelance di bidang pengembangan web.' },
    ],
  },
  {
    period: { en: 'Jan 2024 — Jun 2024', id: 'Jan 2024 — Jun 2024' },
    start: '2024-01',
    end: '2024-06',
    role: { en: 'Full Stack Developer & IT Support', id: 'Full Stack Developer & Dukungan IT' },
    org: 'SEAQIS',
    location: { en: 'Bandung, Indonesia', id: 'Bandung, Indonesia' },
    website: 'https://www.qitepinscience.org',
    logo: '/img/career/seaqis.webp',
    desc: {
      en: 'Designed and implemented a QR code-based attendance system, improving data accuracy and HR operational efficiency.',
      id: 'Merancang dan mengimplementasikan sistem absensi berbasis kode QR, meningkatkan akurasi data dan efisiensi operasional HR.',
    },
    points: [
      { en: 'Built a QR-based check-in/check-out system that replaced manual attendance.', id: 'Membangun sistem absen berbasis QR yang menggantikan pencatatan manual.' },
      { en: 'Reduced manual errors and improved data accuracy for HR reporting.', id: 'Menekan kesalahan manual dan meningkatkan akurasi data untuk pelaporan HR.' },
      { en: 'Collaborated with stakeholders to integrate the system into existing workflows.', id: 'Berkolaborasi dengan pemangku kepentingan untuk mengintegrasikan sistem ke alur kerja yang ada.' },
    ],
  },
  {
    period: { en: 'Feb 2024 — Apr 2024', id: 'Feb 2024 — Apr 2024' },
    start: '2024-02',
    end: '2024-04',
    role: { en: 'Founder', id: 'Pendiri' },
    org: 'KodeSatSet',
    location: { en: 'Jombang, Indonesia', id: 'Jombang, Indonesia' },
    website: 'https://www.instagram.com/kodesatset',
    logo: '/img/career/kodesatset.webp',
    desc: {
      en: 'Founded a technology course program focused on mobile app development, designing the curriculum and running classes.',
      id: 'Mendirikan program kursus teknologi yang berfokus pada pengembangan aplikasi mobile, merancang kurikulum, dan menjalankan kelas.',
    },
    points: [
      { en: 'Trained 50+ students in React Native using Android Studio and emulators.', id: 'Melatih 50+ siswa dalam React Native dengan Android Studio dan emulator.' },
      { en: 'Designed the curriculum and structured learning materials.', id: 'Merancang kurikulum dan materi belajar yang terstruktur.' },
      { en: 'Ran class operations and provided direct, hands-on mentorship.', id: 'Mengelola operasional kelas dan memberikan bimbingan langsung.' },
    ],
  },
];

const career: CareerItem[] = careerRaw.toSorted((a, b) => b.start.localeCompare(a.start));

/* ---------------------------------------------------------------------
   The site object
   --------------------------------------------------------------------- */

export interface SiteConfig {
  name: string;
  alias: string;
  /** Public display name — "FIQTOR". */
  owner: string;
  /** Legal name. Only surfaced in the About section and structured data. */
  legalName: string;
  role: string;
  headline: string;
  years: number;
  /** Satisfied clients. Rendered as `100+` on the hero. */
  clients: number;
  email: string;
  businessEmail: string;
  wa: string;
  github: string;
  wakatime: string;
  tz: string;
  tzLabel: string;
  portrait: string;
  resume: typeof RESUME;
  company: typeof COMPANY;
  social: typeof SOCIAL_LINKS;
  stack: string[];
  services: Service[];
  /** Real client quotes (photo + business name only). */
  testimonials: Testimonial[];
  process: Step[];
  faq: Faq[];
  /** Rotating words under the hero title. */
  headlineRotator: string[];
  projects: Project[];
  /** Flagship projects for the homepage grid. */
  featuredProjects: Project[];
  certs: Cert[];
  /** Certificate grouping for the certificate page. */
  certGroups: CertGroup[];
  /** Flagship certificates, in curated order (certificate page default view). */
  certsFeatured: Cert[];
  /** Featured certificates for the homepage. */
  featuredCerts: Cert[];
  career: CareerItem[];
  links: LinkItem[];
  socialLinks: SocialLink[];
  hubs: LinktreeHub[];
  /**
   * Form options are bilingual like the rest of the site: an Indonesian
   * visitor must not be offered "Other" / "Flexible" in an English-only chip.
   * The English value is used as the stable key, the active language is used
   * as the label that gets sent to the owner.
   */
  contactTypes: LocalizedText[];
  /** Budget bands bracketing the published service floors (1,2–1,8jt). */
  budgets: LocalizedText[];
  timelines: LocalizedText[];
  /** One honest line under the price table: starting points, not fixed quotes. */
  budgetNote: LocalizedText;
}

export interface CertGroup {
  id: string;
  label: LocalizedText;
  desc: LocalizedText;
  /** Certificate ids (slug of the raw title) that belong to this group. */
  ids: string[];
}

export const S: SiteConfig = {
  name: BRAND_NAME,
  alias: OWNER_ALIAS,
  owner: OWNER_NAME,
  legalName: LEGAL_NAME,
  role: JOB_TITLE,
  headline: HEADLINE,
  years: YEARS_OF_EXPERIENCE,
  clients: CLIENTS_SATISFIED,
  email: CONTACT_EMAIL,
  businessEmail: BUSINESS_EMAIL,
  wa: WHATSAPP_NUMBER,
  github: GITHUB_USERNAME,
  wakatime: WAKATIME_USERNAME,
  tz: TIMEZONE,
  tzLabel: TIMEZONE_LABEL,
  portrait: PORTRAIT_IMAGE,
  resume: RESUME,
  company: COMPANY,
  social: SOCIAL_LINKS,

  stack: [
    'TypeScript',
    'JavaScript',
    'React',
    'Next.js',
    'Tailwind CSS',
    'Node.js',
    'Express',
    'Laravel',
    'PHP',
    'Python',
    'PostgreSQL',
    'MySQL',
    'Docker',
    'AWS',
    'OpenAI',
    'Gemini',
    'n8n',
    'Three.js',
  ],

  services: [
    {
      slug: 'app-development',
      title: { en: 'App Development', id: 'Pengembangan Aplikasi' },
      desc: {
        en: 'Web, mobile, and desktop apps your customers actually enjoy using — quick to open, easy to understand, and ready to grow with your business. From the first sketch to going live, one team handles it all.',
        id: 'Aplikasi web, mobile, dan desktop yang benar-benar nyaman dipakai pelanggan — cepat dibuka, mudah dimengerti, dan siap tumbuh bersama bisnis Anda. Dari sketsa pertama sampai online, ditangani satu tim.',
      },
      meta: {
        en: 'Loads fast · Easy to use · Built to grow',
        id: 'Cepat dibuka · Mudah dipakai · Siap berkembang',
      },
      fitsFor: {
        en: 'Companies, online stores, and internal tools that need a system shaped around their own workflow.',
        id: 'Perusahaan, toko online, dan tools internal yang butuh sistem mengikuti alur kerja mereka sendiri.',
      },
      from: { en: 'From Rp 1,500,000', id: 'Mulai Rp 1.500.000' },
    },
    {
      slug: 'ai-integration',
      title: { en: 'AI Integration', id: 'Integrasi AI' },
      desc: {
        en: 'Put a smart assistant inside your product: one that answers customers around the clock on WhatsApp, drafts documents in seconds, and knows your business well enough that you can trust its answers.',
        id: 'Sematkan asisten pintar ke dalam produk Anda: menjawab pelanggan kapan saja lewat WhatsApp, menyusun dokumen dalam hitungan detik, dan memahami bisnis Anda cukup dalam sehingga jawabannya bisa dipercaya.',
      },
      meta: {
        en: 'Replies 24/7 · Less manual work · Answers you can trust',
        id: 'Balas 24/7 · Kerja manual berkurang · Jawaban terpercaya',
      },
      fitsFor: {
        en: 'Businesses drowning in chats and manual admin, or growing teams that want sales, stock, and finance in one place.',
        id: 'Bisnis yang kewalahan chat dan admin manual, atau tim berkembang yang ingin penjualan, stok, dan keuangan di satu tempat.',
      },
      from: { en: 'From Rp 1,800,000', id: 'Mulai Rp 1.800.000' },
    },
    {
      slug: 'it-consulting',
      title: { en: 'IT Consulting', id: 'Konsultasi IT' },
      desc: {
        en: 'Clear advice on what to build next — and what to skip. You get a practical plan, a realistic budget, and straight answers, so every rupiah goes to technology that actually moves the business forward.',
        id: 'Saran jelas tentang apa yang perlu dibangun berikutnya — dan apa yang sebaiknya dilewati. Anda dapat rencana praktis, anggaran realistis, dan jawaban jujur, sehingga setiap rupiah dipakai untuk teknologi yang benar-benar memajukan bisnis.',
      },
      meta: {
        en: 'Clear direction · No wasted budget · Decisions you can defend',
        id: 'Arah jelas · Anggaran tidak terbuang · Keputusan berbasis data',
      },
      fitsFor: {
        en: 'Businesses that already have a system (or a plan) and need an honest second opinion before spending more.',
        id: 'Bisnis yang sudah punya sistem (atau rencana) dan butuh pendapat kedua yang jujur sebelum mengeluarkan biaya lagi.',
      },
      from: { en: 'Scoped per project', id: 'Sesuai lingkup' },
    },
    {
      slug: 'automation',
      title: { en: 'Automation Everything', id: 'Otomatisasi Segalanya' },
      desc: {
        en: 'Stop doing the same task by hand every day. Leads get followed up, reports get sent, and orders get handled automatically — so your team spends its time on customers and work that matters.',
        id: 'Berhenti mengerjakan tugas yang sama secara manual setiap hari. Follow-up prospek, laporan, dan pesanan berjalan otomatis — sehingga tim Anda bisa fokus pada pelanggan dan pekerjaan yang penting.',
      },
      meta: {
        en: 'Hours saved every week · Fewer mistakes · Grows without extra staff',
        id: 'Hemat jam kerja · Minim salah input · Naik skala tanpa tambah staf',
      },
      fitsFor: {
        en: 'Schools, campuses, restaurants, and cafés that want to cut admin hours and serve customers faster.',
        id: 'Sekolah, kampus, restoran, dan kafe yang ingin memangkas jam administrasi dan melayani pelanggan lebih cepat.',
      },
      from: { en: 'From Rp 1,200,000', id: 'Mulai Rp 1.200.000' },
    },
  ],

  process: [
    {
      title: { en: 'Talk', id: 'Ngobrol' },
      desc: {
        en: 'Tell me the idea and the goal. We turn it into clear, written requirements.',
        id: 'Ceritakan ide dan tujuannya. Kita ubah menjadi kebutuhan yang jelas dan tertulis.',
      },
    },
    {
      title: { en: 'Plan', id: 'Rencana' },
      desc: {
        en: 'Scope, timeline, and budget are agreed before a single line is written.',
        id: 'Ruang lingkup, waktu, dan biaya disepakati sebelum satu baris kode ditulis.',
      },
    },
    {
      title: { en: 'Build', id: 'Bangun' },
      desc: {
        en: 'Work happens in visible increments — you can review progress and leave feedback.',
        id: 'Pengerjaan bertahap dan terlihat — Anda bisa meninjau progres dan memberi masukan.',
      },
    },
    {
      title: { en: 'Ship', id: 'Rilis' },
      desc: {
        en: 'Launch, hand-over, and support afterwards. Nothing is dropped after deploy.',
        id: 'Peluncuran, serah terima, dan dukungan setelahnya. Tidak ada yang ditinggal setelah deploy.',
      },
    },
  ],

  /**
   * The FAQ rendered by `<FaqList />` and the source of the page's
   * `FAQPage` structured data (see `src/config/Seo.ts`).
   *
   * SINGLE SOURCE OF TRUTH: the first entry is the "who is this" answer that
   * both `/` and `/contact` publish, and every entry below it is rendered on
   * `/contact`. `Seo.ts` filters this list down to the questions a given route
   * actually shows, so the schema can never describe an answer a visitor (or
   * a Google reviewer) cannot see — an FAQPage rich result requires exactly
   * that. Add a question here and it appears in the UI *and* the schema.
   */
  faq: [
    {
      q: { en: `Who is ${BRAND_NAME}?`, id: `Siapa ${BRAND_NAME}?` },
      a: {
        en: `${BRAND_NAME} is an AI and software engineer from ${COUNTRY}, founder of ${COMPANY.name}, with ${YEARS_OF_EXPERIENCE}+ years of experience and ${projects.length} shipped projects.`,
        id: `${BRAND_NAME} adalah AI & software engineer dari ${COUNTRY}, pendiri ${COMPANY.name}, dengan pengalaman ${YEARS_OF_EXPERIENCE}+ tahun dan ${projects.length} proyek yang sudah dirilis.`,
      },
    },
    {
      q: { en: 'What can you build?', id: 'Apa saja yang bisa dikerjakan?' },
      a: {
        en: 'Web apps, business systems (ERP, CRM, HRIS, school platforms), e-commerce, AI integrations, automation, and interactive 3D experiences. If you are unsure whether your need fits, just ask — you will get an honest answer.',
        id: 'Aplikasi web, sistem bisnis (ERP, CRM, HRIS, platform sekolah), e-commerce, integrasi AI, otomasi, dan pengalaman 3D interaktif. Kalau ragu apakah kebutuhanmu cocok, tanyakan saja — jawabannya jujur.',
      },
    },
    {
      q: { en: 'What technology stack do you use?', id: 'Teknologi apa yang dipakai?' },
      a: {
        en: 'Mainly TypeScript, React, Next.js, Node.js, Laravel, PostgreSQL, MySQL, Docker, AWS, the OpenAI and Gemini APIs, n8n, and Three.js — chosen per project rather than forced.',
        id: 'Terutama TypeScript, React, Next.js, Node.js, Laravel, PostgreSQL, MySQL, Docker, AWS, API OpenAI dan Gemini, n8n, serta Three.js — dipilih sesuai proyek, bukan dipaksakan.',
      },
    },
    {
      q: { en: 'How much does it cost?', id: 'Berapa biayanya?' },
      a: {
        en: 'It depends on scope. Send the brief through the form or WhatsApp and an estimate follows once the requirements are understood.',
        id: 'Tergantung ruang lingkup. Kirim ringkasan lewat form atau WhatsApp, lalu estimasi dikirim setelah kebutuhan dipahami.',
      },
    },
    {
      q: { en: 'How long does a project take?', id: 'Berapa lama pengerjaannya?' },
      a: {
        en: 'A landing page is a matter of days; a full platform takes longer. The timeline is agreed up front and tracked in the open.',
        id: 'Landing page hitungan hari; platform penuh butuh lebih lama. Jadwal disepakati di awal dan dipantau secara terbuka.',
      },
    },
    {
      q: { en: 'What certifications do you hold?', id: 'Sertifikasi apa saja yang dimiliki?' },
      a: {
        en: `${BRAND_NAME} holds the BNSP national Junior Web Developer competency certificate, was 1st of 24 teams in the SEAMEO QITEP in Science web cloud engineering competition, placed 4th of 44 in LKS Web Technologies (East Java), and completed freeCodeCamp, Dicoding and W3Docs programs — ${certs.reduce((n, c) => n + c.count, 0)} credentials in total.`,
        id: `${BRAND_NAME} memegang sertifikat kompetensi nasional BNSP Junior Web Developer, juara 1 dari 24 tim di kompetisi web cloud engineering SEAMEO QITEP in Science, peringkat 4 dari 44 di LKS Web Technologies (Jawa Timur), serta menuntaskan program freeCodeCamp, Dicoding, dan W3Docs — total ${certs.reduce((n, c) => n + c.count, 0)} kredensial.`,
      },
    },
    {
      q: { en: 'Do you work with international clients?', id: 'Apakah bisa bekerja dengan klien luar negeri?' },
      a: {
        en: 'Yes. Communication is available in English and Bahasa Indonesia, in the GMT+7 (WIB) timezone with overlap for other regions.',
        id: 'Bisa. Komunikasi tersedia dalam bahasa Inggris dan Indonesia, zona waktu GMT+7 (WIB) dengan overlap untuk wilayah lain.',
      },
    },
    {
      q: { en: 'How do we start?', id: 'Bagaimana cara memulai?' },
      a: {
        en: 'Pick a channel: the form, WhatsApp, or email. The clearer the brief, the faster the estimate.',
        id: 'Pilih jalur: form, WhatsApp, atau email. Semakin jelas ringkasannya, semakin cepat estimasinya.',
      },
    },
  ],

  /**
   * Real client quotes from iarty.biz.id, ordered so the homepage shows the
   * strongest six first. Photos live in /public/img/testimonials (WebP).
   */
  testimonials: [
    {
      name: 'Alfahrisyahh',
      role: { en: 'Founder, glofiee.com', id: 'Pendiri, glofiee.com' },
      quote: {
        en: 'The quality of service and support we received was outstanding. They truly understand what businesses need.',
        id: 'Kualitas layanan dan dukungan yang kami terima luar biasa. Mereka benar-benar paham apa yang dibutuhkan bisnis.',
      },
      img: '/img/testimonials/alfahrisyah.webp',
    },
    {
      name: 'Djoyo Florist',
      role: { en: 'Owner, Djoyo Florist', id: 'Pemilik, Djoyo Florist' },
      quote: {
        en: 'Your website is really useful for displaying my flower decoration business products, thank you.',
        id: 'Websitenya sangat berguna untuk menampilkan produk bisnis dekorasi bunga saya, terima kasih.',
      },
      img: '/img/testimonials/djoyo-florist.webp',
    },
  ],

  headlineRotator: [
    'full stack web apps',
    'AI automation',
    'business systems',
    'interactive 3D',
  ],

  projects,
  featuredProjects: featured,
  certs,
  certGroups: CERT_GROUPS,
  certsFeatured: featuredCerts,
  featuredCerts: featuredCerts.filter((c) => c.featured).slice(0, 4),
  career,

  /*
   * Link-hub rows. Everything here is rendered as a full-width row with a
   * label and a note, so every entry has to earn its vertical space.
   *
   * Deliberately NOT in this list:
   *  - `Portfolio` (`/`) — a linktree that links to the page you are already
   *    on is dead weight; the row was previously `featured`, so it also drew
   *    a "Start here" badge pointing at the current URL.
   *  - IARTY / IARTY AI — already promoted to the three brand tiles above
   *    (`hubs`), where they read better and are reachable in one tap.
   *  - WhatsApp / Instagram / TikTok / GitHub — already in the round icon
   *    row (`soc`); repeating them as rows put the same five destinations on
   *    the page twice.
   * The icon row and the brand tiles are the compact "+2" home for those, so
   * the list stays reserved for destinations that appear nowhere else.
   */
  links: [
    { label: { en: 'Contact me', id: 'Hubungi saya' }, note: { en: 'Project brief, question, or just say hi', id: 'Ringkasan proyek, pertanyaan, atau sekadar menyapa' }, url: '/contact', icon: 'mail', featured: true },
    { label: { en: 'Projects', id: 'Proyek' }, note: { en: 'Web apps, AI, business systems', id: 'Aplikasi web, AI, sistem bisnis' }, url: '/projects', icon: 'folder' },
    { label: { en: 'Certificates', id: 'Sertifikat' }, note: { en: 'Verified learning', id: 'Bukti belajar yang terverifikasi' }, url: '/certificates', icon: 'cert' },
  ],

  /*
   * The round icon row. This is now the ONLY place socials are rendered, so
   * the list below it does not repeat them. Ordered by how likely a visitor
   * is to want it: messaging first, then places to follow, then code.
   * `linkedin` was in the old static list but had no matching `links` row, so
   * it was silently dropped and never appeared at all.
   * No `mail` entry: "Contact me" is the featured row in `links`, and putting
   * it here too would show the same destination twice on one screen.
   */
  socialLinks: [
    { icon: 'whatsapp', label: { en: 'WhatsApp', id: 'WhatsApp' }, url: `https://wa.me/${WHATSAPP_NUMBER}`, external: true },
    { icon: 'instagram', label: { en: 'Instagram', id: 'Instagram' }, url: SOCIAL_LINKS.instagram, external: true },
    { icon: 'tiktok', label: { en: 'TikTok', id: 'TikTok' }, url: SOCIAL_LINKS.tiktok, external: true },
    { icon: 'github', label: { en: 'GitHub', id: 'GitHub' }, url: SOCIAL_LINKS.github, external: true },
    { icon: 'linkedin', label: { en: 'LinkedIn', id: 'LinkedIn' }, url: SOCIAL_LINKS.linkedin, external: true },
  ],

  hubs: [
    { label: { en: 'Official Website', id: 'Situs Resmi' }, domain: 'iarty.biz.id', href: COMPANY.url, image: COMPANY.image },
    { label: { en: 'IARTY AI', id: 'IARTY AI' }, domain: 'ai.iarty.biz.id', href: COMPANY.aiUrl, image: COMPANY.image },
    { label: { en: 'Marketplace', id: 'Marketplace' }, domain: 'marketplace.iarty.biz.id', href: COMPANY.marketplaceUrl, image: COMPANY.image },
  ],

  contactTypes: [
    { en: 'Web App', id: 'Aplikasi Web' },
    { en: 'AI Integration', id: 'Integrasi AI' },
    { en: 'Business System', id: 'Sistem Bisnis' },
    { en: 'Automation', id: 'Otomatisasi' },
    { en: 'Landing Page', id: 'Landing Page' },
    { en: 'Other', id: 'Lainnya' },
  ],
  /*
   * Budget bands mirror the published price ladder (Automation 1,2jt · App
   * 1,5jt · AI 1,8jt). The old top band was `> Rp 3jt`, i.e. above every
   * service floor, so every serious lead picked the same chip and the field
   * stopped qualifying anyone.
   */
  budgets: [
    { en: '< Rp 1,5jt', id: '< Rp 1,5jt' },
    { en: 'Rp 1,5jt – 3jt', id: 'Rp 1,5jt – 3jt' },
    { en: 'Rp 3jt – 7jt', id: 'Rp 3jt – 7jt' },
    { en: '> Rp 7jt', id: '> Rp 7jt' },
    { en: 'Not sure yet', id: 'Belum tahu' },
  ],
  timelines: [
    { en: 'ASAP', id: 'Secepatnya' },
    { en: '2 – 4 weeks', id: '2 – 4 minggu' },
    { en: '1 – 2 months', id: '1 – 2 bulan' },
    { en: 'Flexible', id: 'Fleksibel' },
  ],
  budgetNote: {
    en: 'Prices are starting points, not fixed quotes — the final figure follows your scope. Tell me your budget and I will say honestly whether it fits.',
    id: 'Harga di atas adalah titik awal, bukan harga mati — angka akhirnya mengikuti lingkup pekerjaan. Sebutkan budget Anda dan saya akan bilang jujur apakah masuk atau tidak.',
  },
};


/* ---------------------------------------------------------------------
   WhatsApp deep links
   --------------------------------------------------------------------- */

/**
 * Build a `wa.me` link with the first message already typed.
 *
 * An empty chat box is the biggest drop-off on a "Chat on WhatsApp" button:
 * the visitor has to decide how to start. Pre-filling the opening line — and
 * naming the service they clicked from — turns the click into a sent message.
 *
 * `topic` is the service title (or any short label) shown to the owner, so a
 * reply can be answered with the right context from the first second.
 */
export const waLink = (lang: 'en' | 'id', topic?: string): string => {
  const head =
    lang === 'en'
      ? `Hi ${S.name}, I'd like to discuss a project`
      : `Halo ${S.name}, saya mau diskusi proyek`;
  const body = topic
    ? lang === 'en'
      ? `${head} — ${topic}. Here is what I have in mind:`
      : `${head} — ${topic}. Kira-kira begini kebutuhannya:`
    : lang === 'en'
      ? `${head}. Here is what I have in mind:`
      : `${head}. Kira-kira begini kebutuhannya:`;
  return `https://wa.me/${S.wa}?text=${encodeURIComponent(body)}`;
};
