/* =====================================================================
   SHARED UTILITIES
   ===================================================================== */

/**
 * `matchMedia` is typed only in the DOM lib, which is not available to the Node
 * tooling that imports this file (SEO generation). Reading it off a typed
 * global works in both environments.
 */
type MQL = { matches: boolean };
const mq = (query: string): MQL | null => {
  const g = globalThis as unknown as { matchMedia?: (q: string) => MQL };
  return typeof g.matchMedia === 'function' ? g.matchMedia(query) : null;
};

export const isReducedMotion = (): boolean => mq('(prefers-reduced-motion: reduce)')?.matches ?? false;

export const isFinePointer = (): boolean => mq('(hover:hover) and (pointer:fine)')?.matches ?? false;

/** Locale-aware date formatter used for certificate issue dates ("Jan 2025"). */
const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/**
 * The certificate data stores dates as English "Mon YYYY" strings (e.g.
 * "Jan 2025"). `id` gets the localized short month; anything unparsable is
 * returned untouched.
 */
export const formatPublished = (raw: string, lang: 'en' | 'id'): string => {
  if (lang === 'en') return raw;
  const m = raw.match(/^([A-Za-z]{3})[a-z]*\s+(\d{4})$/);
  if (!m) return raw;
  const i = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(
    m[1].toLowerCase(),
  );
  return i === -1 ? raw : `${MONTHS_ID[i]} ${m[2]}`;
};

export const pad = (n: number): string => String(n).padStart(2, '0');
export const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
export const ext = (u: string): boolean => /^https?:/.test(u);

/* ---------- icon names ----------
   The icon *paths* (JSX) live in utils.tsx; only the name union is needed by
   data modules, which must stay importable from plain Node (SEO generation). */
export type IconName =
  | 'arrow'
  | 'linktree'
  | 'web'
  | 'store'
  | 'folder'
  | 'whatsapp'
  | 'mail'
  | 'instagram'
  | 'tiktok'
  | 'threads'
  | 'youtube'
  | 'linkedin'
  | 'github'
  | 'cert'
  | 'copy'
  | 'share'
  | 'download'
  | 'search'
  | 'open'
  | 'star';

/* ---------- clock helpers ---------- */
export const localHour = (tz: string): number => {
  const fmt = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', hour12: false, timeZone: tz });
  return Number(fmt.format(new Date()).slice(0, 2));
};

/** Compact number formatter: 130000 → "130K", 1955 → "1.9K". */
export const formatCompact = (value: number): string =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
