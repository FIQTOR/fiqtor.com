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

export type Language = 'en' | 'id' | 'zh';
export type LocalizedText = { en: string; id: string; [key: string]: string | undefined };

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
  tags?: { en: string[]; id: string[]; zh?: string[] };
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
  /** Starting price in IDR integer for currency conversion. */
  amountIDR?: number;
  /** Optional recurring period suffix (e.g. / mo). */
  periodSuffix?: LocalizedText;
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

/**
 * Maximum slug length. Applies to project ids, which are public URLs
 * (`/projects/<id>`) since the case-study pages shipped, so this is a budget
 * for readability in search results as much as for the filesystem.
 */
const SLUG_MAX = 60;

/**
 * Slugify, then truncate at a WORD boundary if the budget is exceeded.
 *
 * A blind `.slice(0, 60)` cuts mid-word, which would produce ids like
 * `a-realtime-public-transport-tracker-i-built-for-greater-jaka`. Cutting on
 * the last `-` before the budget keeps the tail a whole word instead. The hard
 * slice remains as a fallback for the degenerate case of one 60+ character
 * word with no separator at all.
 *
 * NOTE: no current title reaches the budget (longest is 53), so this changes
 * nothing today. It is a guard, not a migration — it exists because these ids
 * became public URLs (`/projects/<id>`) with the case-study pages, and a
 * longer title added later must not silently produce a mid-word URL.
 */
const slug = (s: string): string => {
  const full = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (full.length <= SLUG_MAX) return full;

  const cut = full.slice(0, SLUG_MAX);
  const boundary = cut.lastIndexOf('-');
  // `boundary > 0` rejects a slug that is one unbroken word, and also a hyphen
  // at position 0 (leading hyphens were already stripped above).
  return (boundary > 0 ? cut.slice(0, boundary) : cut).replace(/-+$/, '');
};

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
      ? { en: 'Creative build', id: 'Karya kreatif', zh: '创意开发' }
      : p.category === 'Template'
        ? { en: 'Template', id: 'Template', zh: '网站模板' }
        : p.category === 'Landing Page'
          ? { en: 'Landing page', id: 'Landing page', zh: '品牌落地页' }
          : p.category === 'E-Commerce'
            ? { en: 'E-commerce', id: 'E-commerce', zh: '独立电商' }
            : p.category === 'Business System'
              ? { en: 'Business system', id: 'Sistem bisnis', zh: '企业系统' }
              : p.category === 'AI & Automation'
                ? { en: 'AI & automation', id: 'AI & otomatisasi', zh: 'AI与自动化' }
                : { en: 'Web app', id: 'Aplikasi web', zh: 'Web 应用' };
  return { en: `${kind.en} · ${stack}`, id: `${kind.id} · ${stack}`, zh: `${kind.zh} · ${stack}` };
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
    caption: { en: galleryLabel(src, 'en'), id: galleryLabel(src, 'id'), zh: galleryLabel(src, 'zh') },
  }));
  return {
    id: slug(p.title.en),
    title: p.title,
    year: '2025',
    role: roleFor(p),
    desc: p.description,
    tags: (p.tags?.en ?? []).map((t, k) => ({ en: t, id: p.tags?.id?.[k] ?? t, zh: p.tags?.zh?.[k] ?? t })),
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
  if (merged) return { en: 'Quiz bundle', id: 'Paket kuis', zh: '小测题库合辑' };
  const group = CERT_GROUPS.find((g) => g.ids.includes(id));
  switch (group?.id) {
    case 'competition':
      return { en: 'Competition', id: 'Kompetisi', zh: '竞赛奖项' };
    case 'national':
      return /internship|praktik kerja/i.test(title)
        ? { en: 'Internship', id: 'Magang', zh: '企业实习' }
        : { en: 'National certification', id: 'Sertifikasi nasional', zh: '国家职业资质' };
    case 'course':
      return { en: 'Course', id: 'Kursus', zh: '专业课程' };
    case 'language':
      return { en: 'Language & soft skills', id: 'Bahasa & soft skill', zh: '语言与软技能' };
    case 'event':
      return /webinar/i.test(title) ? { en: 'Webinar', id: 'Webinar', zh: '线上研讨会' } : { en: 'Event', id: 'Event', zh: '技术会议/活动' };
    default:
      return /competition|champion|lks|airofest/i.test(title)
        ? { en: 'Competition', id: 'Kompetisi', zh: '竞赛奖项' }
        : { en: 'Certificate', id: 'Sertifikat', zh: '资格证书' };
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
  headlineRotator: Record<Language, string[]>;
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
      slug: 'landing-page',
      title: { en: 'Landing Page & SMB Site', id: 'Website UMKM & Landing Page', zh: '企业落地页与中小微官网' },
      desc: {
        en: 'Instant, conversion-focused websites for small businesses, local cafés, and products. Clean layout, fast loading, Google Maps, and direct WhatsApp booking ready to launch in days.',
        id: 'Website instan fokus konversi untuk usaha kecil, kafe/resto lokal, dan produk tunggal. Tampilan bersih, cepat dibuka, peta Google Maps, dan tombol WhatsApp siap meluncur cepat.',
        zh: '面向小微企业、咖啡馆与单品的极速转化落地页。界面清爽、极速加载、集成谷歌地图与 WhatsApp 直达咨询，数日内即可交付。',
      },
      meta: {
        en: 'Instant launch · Mobile-first · Direct WhatsApp CTA',
        id: 'Cepat tayang · Nyaman di HP · Konversi langsung ke WhatsApp',
        zh: '快速上线 · 移动端优先 · WhatsApp直达转化',
      },
      fitsFor: {
        en: 'Small businesses, local shops, events, and single products needing a fast online presence.',
        id: 'Usaha kecil, toko/kafe lokal, event, dan produk tunggal yang butuh media promosi siap pakai.',
        zh: '需要快速建立官方网络形象的小型企业、线下门店、品牌活动或单一产品。',
      },
      amountIDR: 800000,
      from: { en: 'From Rp 800,000', id: 'Mulai Rp 800.000', zh: '起价 Rp 800.000' },
    },
    {
      slug: 'app-development',
      title: { en: 'Business Site & Company Profile', id: 'Website Bisnis & Company Profile', zh: '企业官网与品牌形象站' },
      desc: {
        en: 'Professional multi-page websites and custom web applications that establish brand credibility. Fast, responsive, structured catalog or portfolio, and built for search engine visibility.',
        id: 'Website multi-halaman profesional dan aplikasi web kustom untuk membangun kredibilitas bisnis. Cepat, responsif, katalog layanan rapi, dan teroptimasi SEO Google.',
        zh: '专为提升企业公信力打造的专业多页面官网与定制 Web 应用。响应迅速、产品服务目录条理分明、深度优化谷歌 SEO 排名。',
      },
      meta: {
        en: 'Clean architecture · Google SEO ready · High credibility',
        id: 'Arsitektur rapi · Siap SEO Google · Kredibilitas tinggi',
        zh: '架构整洁 · 谷歌SEO优化 · 高信任度',
      },
      fitsFor: {
        en: 'Companies, consultants, clinics, and businesses that need strong credibility with multi-page structure.',
        id: 'Perusahaan, konsultan, klinik, dan bisnis yang butuh kredibilitas tinggi dengan profil multi-halaman.',
        zh: '需要完整多页面展现专业实力的中大型企业、咨询机构、诊所与服务商。',
      },
      amountIDR: 1500000,
      from: { en: 'From Rp 1,500,000', id: 'Mulai Rp 1.500.000', zh: '起价 Rp 1.500.000' },
    },
    {
      slug: 'ecommerce',
      title: { en: 'E-Commerce & Online Store', id: 'Toko Online & E-Commerce D2C', zh: '独立电商与品牌网店' },
      desc: {
        en: 'Direct-to-consumer online stores without marketplace commission fees. Integrated with payment gateways (QRIS, VA, e-Wallet), automated courier shipping calculator, and instant WhatsApp order notifications.',
        id: 'Toko online mandiri tanpa potongan komisi marketplace. Dilengkapi payment gateway otomatis (QRIS, VA, e-Wallet), cek ongkir kurir nasional otomatis, dan notifikasi order instan via WhatsApp.',
        zh: '免平台抽佣的品牌独立网店。原生集成印尼在线支付网关（QRIS、虚拟账户、电子钱包）、全国快递运费自动计算与 WhatsApp 实时订单提醒。',
      },
      meta: {
        en: 'Zero marketplace fees · Auto shipping calculator · QRIS & VA',
        id: 'Bebas komisi · Cek ongkir otomatis · QRIS & VA siap pakai',
        zh: '零平台抽成 · 自动运费计算 · 支持QRIS与网银',
      },
      fitsFor: {
        en: 'Retail brands, fashion, F&B, and distributors wanting direct online sales and full customer ownership.',
        id: 'Brand retail, fashion, F&B, dan distributor yang ingin berjualan langsung ke pembeli.',
        zh: '希望完全掌握客户数据并直接触达消费者的零售品牌、服装、餐饮与分销商。',
      },
      amountIDR: 2900000,
      from: { en: 'From Rp 2,900,000', id: 'Mulai Rp 2.900.000', zh: '起价 Rp 2.900.000' },
    },
    {
      slug: 'modular-system',
      title: { en: 'Web App & Modular System', id: 'Aplikasi Web & Sistem Modular', zh: 'Web 应用与模块化业务系统' },
      desc: {
        en: 'Custom modular web systems built around your operational workflows — start with core modules like POS, inventory, or CRM, and expand as your business grows.',
        id: 'Aplikasi web modular kustom yang dirancang sesuai operasional bisnis Anda — mulai dari 2 modul inti seperti Kasir, Stok, atau CRM, lalu kembangkan saat bisnis tumbuh.',
        zh: '根据真实业务流程定制开发的模块化系统——支持从收银 POS、进销存或 CRM 等核心模块起步，伴随企业规模灵活扩展。',
      },
      meta: {
        en: 'Modular architecture · Role-based access · Cloud database',
        id: 'Arsitektur modular · Hak akses staf aman · Database cloud',
        zh: '模块化架构 · 员工权限分级 · 云端数据库',
      },
      fitsFor: {
        en: 'Growing operations seeking to automate cashier, inventory, client logs, or internal workflows step by step.',
        id: 'Bisnis berkembang yang ingin mengotomatiskan kasir, stok gudang, CRM, atau operasional internal secara bertahap.',
        zh: '需要循序渐进实现收银、库房、客户档案或内部流程数字化的成长型企业。',
      },
      amountIDR: 3500000,
      from: { en: 'From Rp 3,500,000', id: 'Mulai Rp 3.500.000', zh: '起价 Rp 3.500.000' },
    },
    {
      slug: 'ai-integration',
      title: { en: 'AI Integration & Smart Assistant', id: 'Integrasi AI & Asisten Cerdas', zh: 'AI 深度集成与智能助手' },
      desc: {
        en: 'Embed smart LLM assistants into your website or operations: 24/7 WhatsApp customer service, custom document/knowledge-base RAG, and automated workflow pipelines.',
        id: 'Sematkan asisten LLM cerdas ke web atau sistem operasional Anda: customer service WhatsApp 24/7, knowledge base RAG berbasis data internal, dan otomasi alur kerja.',
        zh: '为您的网站或内部系统注入大语言模型能力：24/7 全天候 WhatsApp 智能客服、私有企业知识库 RAG 检索问答与自动化业务管线。',
      },
      meta: {
        en: '24/7 Smart RAG · WhatsApp webhook · Zero hallucination guards',
        id: 'RAG 24/7 akurat · Integrasi webhook WhatsApp · Guardrail anti-halusinasi',
        zh: '24/7精准RAG · WhatsApp对接 · 防幻觉护栏',
      },
      fitsFor: {
        en: 'Businesses handling high chat volumes or wanting AI-driven automation over internal documents.',
        id: 'Bisnis yang kewalahan melayani chat manual atau ingin mengotomatiskan analisis dokumen internal dengan AI.',
        zh: '面临繁重客户咨询压力，或希望借助 AI 对企业内部资料进行自动化知识处理的组织。',
      },
      amountIDR: 4900000,
      from: { en: 'From Rp 4,900,000', id: 'Mulai Rp 4.900.000', zh: '起价 Rp 4.900.000' },
    },
    {
      slug: 'cloud-maintenance',
      title: { en: 'Managed Cloud & Maintenance', id: 'Managed Cloud & Pemeliharaan', zh: '托管云服务与系统运维' },
      desc: {
        en: 'Proactive server uptime monitoring, automated database backups, security patches, bug fixes, and continuous technical support so your software stays fast and reliable.',
        id: 'Pemantauan uptime server 24/7, auto-backup database berkala, pembaruan keamanan, perbaikan bug, dan jaminan operasional sistem bebas gangguan.',
        zh: '全天候 24/7 服务器状态监控、云端数据库自动异地备份、安全漏洞热补丁与专项技术支持，保障系统持久平稳运转。',
      },
      meta: {
        en: '24/7 Uptime · Auto backup · Dedicated WhatsApp support',
        id: 'Monitoring 24/7 · Backup otomatis · Jalur prioritas WhatsApp',
        zh: '全天候监控 · 自动备份 · WhatsApp专属支持通道',
      },
      fitsFor: {
        en: 'Businesses with active systems needing dedicated maintenance, server management, and peace of mind.',
        id: 'Bisnis dengan sistem aktif yang membutuhkan jaminan operasional server dan pemeliharaan rutin.',
        zh: '已有在线业务系统且需要专业服务器托管运维、高可用保障的企业与团队。',
      },
      amountIDR: 750000,
      periodSuffix: { en: ' / mo', id: ' / bln', zh: ' / 月' },
      from: { en: 'From Rp 750,000 / mo', id: 'Mulai Rp 750.000 / bln', zh: '起价 Rp 750.000 / 月' },
    },
  ],

  process: [
    {
      title: { en: 'Talk', id: 'Ngobrol', zh: '沟通' },
      desc: {
        en: 'Tell me the idea and the goal. We turn it into clear, written requirements.',
        id: 'Ceritakan ide dan tujuannya. Kita ubah menjadi kebutuhan yang jelas dan tertulis.',
        zh: '倾听您的构想与业务目标，将其转化为清晰明确的文档化需求。',
      },
    },
    {
      title: { en: 'Plan', id: 'Rencana', zh: '规划' },
      desc: {
        en: 'Scope, timeline, and budget are agreed before a single line is written.',
        id: 'Ruang lingkup, waktu, dan biaya disepakati sebelum satu baris kode ditulis.',
        zh: '在写下第一行代码前，共同敲定交付范围、开发周期与透明预算。',
      },
    },
    {
      title: { en: 'Build', id: 'Bangun', zh: '开发' },
      desc: {
        en: 'Work happens in visible increments — you can review progress and leave feedback.',
        id: 'Pengerjaan bertahap dan terlihat — Anda bisa meninjau progres dan memberi masukan.',
        zh: '采用可见的敏捷递增方式迭代开发，您可以实时查验阶段性成果并反馈。',
      },
    },
    {
      title: { en: 'Ship', id: 'Rilis', zh: '上线' },
      desc: {
        en: 'Production deployment, domain setup, analytics, and handoff so you own the code.',
        id: 'Deploy produksi, setup domain, analitik, dan serah terima sehingga kode sepenuhnya milik Anda.',
        zh: '生产环境部署、域名绑定、数据分析集成与完整源码无保留交付。',
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
      q: { en: `Who is ${BRAND_NAME}?`, id: `Siapa ${BRAND_NAME}?`, zh: `${BRAND_NAME} 是谁?` },
      a: {
        en: `${BRAND_NAME} is an AI and software engineer from ${COUNTRY}, founder of ${COMPANY.name}, with ${YEARS_OF_EXPERIENCE}+ years of experience and ${projects.length} shipped projects.`,
        id: `${BRAND_NAME} adalah AI & software engineer dari ${COUNTRY}, pendiri ${COMPANY.name}, dengan pengalaman ${YEARS_OF_EXPERIENCE}+ tahun dan ${projects.length} proyek yang sudah dirilis.`,
        zh: `${BRAND_NAME} 是来自 ${COUNTRY} 的 AI 与软件工程师, ${COMPANY.name} 创始人, 拥有 ${YEARS_OF_EXPERIENCE}+ 年经验和 ${projects.length} 个已交付项目.`,
      },
    },
    {
      q: { en: 'What can you build?', id: 'Apa saja yang bisa dikerjakan?', zh: '能开发什么?' },
      a: {
        en: 'Web apps, business systems (ERP, CRM, HRIS, school platforms), e-commerce, AI integrations, automation, and interactive 3D experiences. If you are unsure whether your need fits, just ask — you will get an honest answer.',
        id: 'Aplikasi web, sistem bisnis (ERP, CRM, HRIS, platform sekolah), e-commerce, integrasi AI, otomasi, dan pengalaman 3D interaktif. Kalau ragu apakah kebutuhanmu cocok, tanyakan saja — jawabannya jujur.',
        zh: 'Web 应用, 业务系统 (ERP, CRM, HRIS, 学校平台), 电商, AI 集成, 自动化, 以及交互式 3D 体验. 不确定是否符合您的需求? 尽管问 — 会得到诚实回答.',
      },
    },
    {
      q: { en: 'What technology stack do you use?', id: 'Teknologi apa yang dipakai?', zh: '使用什么技术栈?' },
      a: {
        en: 'Mainly TypeScript, React, Next.js, Node.js, Laravel, PostgreSQL, MySQL, Docker, AWS, the OpenAI and Gemini APIs, n8n, and Three.js — chosen per project rather than forced.',
        id: 'Terutama TypeScript, React, Next.js, Node.js, Laravel, PostgreSQL, MySQL, Docker, AWS, API OpenAI dan Gemini, n8n, serta Three.js — dipilih sesuai proyek, bukan dipaksakan.',
        zh: '主要是 TypeScript, React, Next.js, Node.js, Laravel, PostgreSQL, MySQL, Docker, AWS, OpenAI 和 Gemini API, n8n, 以及 Three.js — 按项目选择, 不强制.',
      },
    },
    {
      q: { en: 'How much does it cost?', id: 'Berapa biayanya?', zh: '费用是多少?' },
      a: {
        en: 'It depends on scope. Send the brief through the form or WhatsApp and an estimate follows once the requirements are understood.',
        id: 'Tergantung ruang lingkup. Kirim ringkasan lewat form atau WhatsApp, lalu estimasi dikirim setelah kebutuhan dipahami.',
        zh: '取决于范围. 通过表单或 WhatsApp 发送简报, 了解需求后会提供报价.',
      },
    },
    {
      q: { en: 'How long does a project take?', id: 'Berapa lama pengerjaannya?', zh: '项目周期多长?' },
      a: {
        en: 'A landing page is a matter of days; a full platform takes longer. The timeline is agreed up front and tracked in the open.',
        id: 'Landing page hitungan hari; platform penuh butuh lebih lama. Jadwal disepakati di awal dan dipantau secara terbuka.',
        zh: '落地页只需几天, 完整平台需要更长时间. 时间表提前商定并公开追踪.',
      },
    },
    {
      q: { en: 'What certifications do you hold?', id: 'Sertifikasi apa saja yang dimiliki?', zh: '持有什么证书?' },
      a: {
        en: `${BRAND_NAME} holds the BNSP national Junior Web Developer competency certificate, was 1st of 24 teams in the SEAMEO QITEP in Science web cloud engineering competition, placed 4th of 44 in LKS Web Technologies (East Java), and completed freeCodeCamp, Dicoding and W3Docs programs — ${certs.reduce((n, c) => n + c.count, 0)} credentials in total.`,
        id: `${BRAND_NAME} memegang sertifikat kompetensi nasional BNSP Junior Web Developer, juara 1 dari 24 tim di kompetisi web cloud engineering SEAMEO QITEP in Science, peringkat 4 dari 44 di LKS Web Technologies (Jawa Timur), serta menuntaskan program freeCodeCamp, Dicoding, dan W3Docs — total ${certs.reduce((n, c) => n + c.count, 0)} kredensial.`,
        zh: `${BRAND_NAME} 持有 BNSP 国家级初级 Web 开发者能力证书, 在 SEAMEO QITEP in Science Web 云工程竞赛中 24 支队伍获第 1 名, 在 LKS Web Technologies (东爪哇) 44 人中排第 4, 并完成 freeCodeCamp, Dicoding 和 W3Docs 项目 — 共 ${certs.reduce((n, c) => n + c.count, 0)} 个证书.`,
      },
    },
    {
      q: { en: 'Do you work with international clients?', id: 'Apakah bisa bekerja dengan klien luar negeri?', zh: '能与海外客户合作吗?' },
      a: {
        en: 'Yes. Communication is available in English and Bahasa Indonesia, in the GMT+7 (WIB) timezone with overlap for other regions.',
        id: 'Bisa. Komunikasi tersedia dalam bahasa Inggris dan Indonesia, zona waktu GMT+7 (WIB) dengan overlap untuk wilayah lain.',
        zh: '可以. 支持英语和印尼语沟通, GMT+7 (WIB) 时区, 与其他地区有时间重叠.',
      },
    },
    {
      q: { en: 'How do we start?', id: 'Bagaimana cara memulai?', zh: '如何开始?' },
      a: {
        en: 'Pick a channel: the form, WhatsApp, or email. The clearer the brief, the faster the estimate.',
        id: 'Pilih jalur: form, WhatsApp, atau email. Semakin jelas ringkasannya, semakin cepat estimasinya.',
        zh: '选择渠道: 表单, WhatsApp, 或邮件. 简报越清晰, 报价越快.',
      },
    },
  ],

  /**
   * Real client quotes from iarty.biz.id, ordered so the homepage shows the
   * strongest six first. Photos live in /public/img/testimonials (WebP).
   */
  testimonials: [
    {
      name: 'Kedai Nagata',
      role: { en: 'Owner, Kedai Nagata', id: 'Pemilik, Kedai Nagata' },
      quote: {
        en: 'Now customers can see the menu and location themselves, so our team can focus on serving. The coffee and bakmie finally have an online home.',
        id: 'Sekarang pelanggan bisa lihat menu dan lokasi sendiri, jadi tim kami lebih fokus melayani. Kopi dan bakmie-nya akhirnya punya rumah online.',
      },
      img: '/img/testimonials/kedai-nagata.webp',
    },
    {
      name: 'Ijjo Cafe',
      role: { en: 'Owner, Ijjo Cafe', id: 'Pemilik, Ijjo Cafe' },
      quote: {
        en: 'Our idea of a workspace that doubles as a hangout spot came across perfectly on the website. Many visitors came after browsing it on their phone first.',
        id: 'Konsep ruang kerja sekaligus tempat nongkrong kami tersampaikan dengan pas di website. Banyak yang datang setelah lihat-lihat dulu dari HP.',
      },
      img: '/img/testimonials/ijjo-cafe.webp',
    },
    {
      name: '808 Coffeebar',
      role: { en: 'Owner, 808 Coffeebar', id: 'Pemilik, 808 Coffeebar' },
      quote: {
        en: 'Our industrial street-art character is hard to put into words, but IARTY captured it. The website feels like our coffeebar.',
        id: 'Karakter street-art industrial kami susah dijelaskan pakai kata, tapi IARTY berhasil menangkapnya. Website-nya terasa seperti coffeebar kami.',
      },
      img: '/img/testimonials/808-coffeebar.webp',
    },
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
      name: 'BM Coffee',
      role: { en: 'Owner, BM Coffee', id: 'Pemilik, BM Coffee' },
      quote: {
        en: 'The website makes us look far more professional to new customers. It was built quickly and the revision process was communicative.',
        id: 'Website-nya membuat kami terlihat lebih profesional di mata pelanggan baru. Pengerjaannya cepat dan revisinya komunikatif.',
      },
      img: '/img/testimonials/bm-coffee.webp',
    },
    {
      name: 'Fine Co Workingspace',
      role: { en: 'Owner, Fine Co Workingspace Surabaya', id: 'Pemilik, Fine Co Workingspace Surabaya' },
      quote: {
        en: 'We are not just a cafe, we are also a workspace. IARTY told both stories on one page without it feeling crowded.',
        id: 'Bukan cuma cafe, kami juga ruang kerja. IARTY bisa menyusun dua cerita itu dalam satu halaman tanpa terasa penuh.',
      },
      img: '/img/testimonials/fine-co-workingspace.webp',
    },
    {
      name: 'Warkop Yangsio',
      role: { en: 'Owner, Warkop Yangsio Surabaya', id: 'Pemilik, Warkop Yangsio Surabaya' },
      quote: {
        en: 'We wanted this friendly coffee spot to feel open to anyone, and that is exactly what the website shows. Many new customers say it is easy to find.',
        id: 'Kami ingin tempat ngopi yang friendly ini terasa terbuka untuk siapa saja, dan itu yang muncul di websitenya. Pelanggan baru banyak yang bilang gampang dicari.',
      },
      img: '/img/testimonials/warkop-yangsio.webp',
    },
    {
      name: 'Nukcoffee',
      role: { en: 'Owner, Nukcoffee', id: 'Pemilik, Nukcoffee' },
      quote: {
        en: 'That warm, at-home feeling was the priority for us, and IARTY understood it without much explanation. A relaxed process with a serious result.',
        id: 'Kesan hangat seperti di rumah jadi hal utama buat kami, dan IARTY paham itu tanpa perlu banyak dijelaskan. Prosesnya santai tapi hasilnya serius.',
      },
      img: '/img/testimonials/nukcoffee.webp',
    },
    {
      name: 'Titik Koma Tenggilis',
      role: { en: 'Owner, Titik Koma Tenggilis', id: 'Pemilik, Titik Koma Tenggilis' },
      quote: {
        en: 'Our menu and the story behind our brewing process became much easier for customers to read. The IARTY team patiently took in every small detail we wanted.',
        id: 'Menu dan cerita soal proses brewing kami jadi lebih mudah dibaca pelanggan. Tim IARTY sabar menampung detail-detail kecil yang kami mau.',
      },
      img: '/img/testimonials/titik-koma-tenggilis.webp',
    },
    {
      name: 'Kokkili Cafe',
      role: { en: 'Owner, Kokkili Cafe', id: 'Pemilik, Kokkili Cafe' },
      quote: {
        en: 'Our coffee and brunch are presented cleanly, never overdone. The final result is proportionate and looks good at every screen size.',
        id: 'Gambarannya tentang kopi dan brunch kami tampil rapi, tidak berlebihan. Hasil akhirnya proporsional dan enak dilihat di semua ukuran layar.',
      },
      img: '/img/testimonials/kokkili-cafe.webp',
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

  headlineRotator: {
    en: [
      'full stack web apps',
      'AI automation',
      'business systems',
      'interactive 3D',
    ],
    id: [
      'aplikasi web full stack',
      'otomasi AI',
      'sistem bisnis',
      '3D interaktif',
    ],
    zh: [
      '全栈 Web 应用',
      'AI 智能自动化',
      '企业业务系统',
      '交互式 3D 体验',
    ],
  },

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
    { label: { en: 'Contact me', id: 'Hubungi saya', zh: '联系我' }, note: { en: 'Project brief, question, or just say hi', id: 'Ringkasan proyek, pertanyaan, atau sekadar menyapa', zh: '项目需求、咨询或打个招呼' }, url: '/contact', icon: 'mail', featured: true },
    { label: { en: 'Projects', id: 'Proyek', zh: '精选项目' }, note: { en: 'Web apps, AI, business systems', id: 'Aplikasi web, AI, sistem bisnis', zh: 'Web 应用、AI、企业系统' }, url: '/projects', icon: 'folder' },
    { label: { en: 'Certificates', id: 'Sertifikat', zh: '专业证书' }, note: { en: 'Verified learning', id: 'Bukti belajar yang terverifikasi', zh: '经官方验证的学习认证' }, url: '/certificates', icon: 'cert' },
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
    { icon: 'whatsapp', label: { en: 'WhatsApp', id: 'WhatsApp', zh: 'WhatsApp' }, url: `https://wa.me/${WHATSAPP_NUMBER}`, external: true },
    { icon: 'instagram', label: { en: 'Instagram', id: 'Instagram', zh: 'Instagram' }, url: SOCIAL_LINKS.instagram, external: true },
    { icon: 'tiktok', label: { en: 'TikTok', id: 'TikTok', zh: 'TikTok' }, url: SOCIAL_LINKS.tiktok, external: true },
    { icon: 'github', label: { en: 'GitHub', id: 'GitHub', zh: 'GitHub' }, url: SOCIAL_LINKS.github, external: true },
    { icon: 'linkedin', label: { en: 'LinkedIn', id: 'LinkedIn', zh: 'LinkedIn' }, url: SOCIAL_LINKS.linkedin, external: true },
  ],

  hubs: [
    { label: { en: 'Official Website', id: 'Situs Resmi', zh: '官方网站' }, domain: 'iarty.biz.id', href: COMPANY.url, image: COMPANY.image },
    { label: { en: 'IARTY AI', id: 'IARTY AI', zh: 'IARTY AI' }, domain: 'ai.iarty.biz.id', href: COMPANY.aiUrl, image: COMPANY.image },
    { label: { en: 'Marketplace', id: 'Marketplace', zh: '产品市场' }, domain: 'marketplace.iarty.biz.id', href: COMPANY.marketplaceUrl, image: COMPANY.image },
  ],

  contactTypes: [
    { en: 'Web App', id: 'Aplikasi Web', zh: 'Web 应用' },
    { en: 'AI Integration', id: 'Integrasi AI', zh: 'AI 深度集成' },
    { en: 'Business System', id: 'Sistem Bisnis', zh: '企业系统' },
    { en: 'Automation', id: 'Otomatisasi', zh: '工作流自动化' },
    { en: 'Landing Page', id: 'Landing Page', zh: '品牌落地页' },
    { en: 'Other', id: 'Lainnya', zh: '其他需求' },
  ],
  /*
   * Budget bands mirror the published price ladder (Landing Page 800rb · Business
   * Site 1,5jt · Modular System 3,5jt).
   */
  budgets: [
    { en: '< Rp 1jt', id: '< Rp 1jt', zh: '< Rp 100万' },
    { en: 'Rp 1jt – 3jt', id: 'Rp 1jt – 3jt', zh: 'Rp 100万 – 300万' },
    { en: 'Rp 3,5jt – 7jt', id: 'Rp 3,5jt – 7jt', zh: 'Rp 350万 – 700万' },
    { en: '> Rp 7jt', id: '> Rp 7jt', zh: '> Rp 700万' },
    { en: 'Not sure yet', id: 'Belum tahu', zh: '暂不确定' },
  ],
  timelines: [
    { en: 'ASAP', id: 'Secepatnya', zh: '越快越好' },
    { en: '2 – 4 weeks', id: '2 – 4 minggu', zh: '2 – 4 周' },
    { en: '1 – 2 months', id: '1 – 2 bulan', zh: '1 – 2 个月' },
    { en: 'Flexible', id: 'Fleksibel', zh: '时间灵活' },
  ],
  budgetNote: {
    en: 'Prices are starting points, not fixed quotes — the final figure follows your scope. Tell me your budget and I will say honestly whether it fits.',
    id: 'Harga di atas adalah titik awal, bukan harga mati — angka akhirnya mengikuti lingkup pekerjaan. Sebutkan budget Anda dan saya akan bilang jujur apakah masuk atau tidak.',
    zh: '上述价格为初始起步参考价，最终报价取决于具体项目范围。请告诉我您的预算预期，我将坦诚评估可行性。',
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
export const waLink = (lang: Language, topic?: string): string => {
  const head =
    lang === 'zh'
      ? `你好 ${S.name}，我想咨询一个项目合作`
      : lang === 'id'
      ? `Halo ${S.name}, saya mau diskusi proyek`
      : `Hi ${S.name}, I'd like to discuss a project`;
  const body = topic
    ? lang === 'zh'
      ? `${head} — ${topic}。我的具体需求如下：`
      : lang === 'id'
      ? `${head} — ${topic}. Kira-kira begini kebutuhannya:`
      : `${head} — ${topic}. Here is what I have in mind:`
    : lang === 'zh'
      ? `${head}。我的具体需求如下：`
      : lang === 'id'
      ? `${head}. Kira-kira begini kebutuhannya:`
      : `${head}. Here is what I have in mind:`;
  return `https://wa.me/${S.wa}?text=${encodeURIComponent(body)}`;
};
