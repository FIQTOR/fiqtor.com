import type { IconName } from './utils';

export type { IconName };

/* =====================================================================
   JSX UTILITIES — icons and clipboard (kept out of utils.ts so Node code
   such as the SEO generator can import the pure helpers without JSX).
   ===================================================================== */

/* ---------- icons (inline SVG paths, no icon-font dependency) ---------- */
const svgPath = (p: string): string => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

export const ICONS: Record<IconName, string> = {
  arrow: svgPath('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  // linktree: one root forking into two branches, each ending in a link dot
  linktree: svgPath('<path d="M12 21v-5M6 9v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9M12 16v-4"/><circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="12" cy="4.2" r="2.2"/>'),
  web: svgPath('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>'),
  store: svgPath('<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>'),
  folder: svgPath('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  whatsapp: svgPath('<path d="M21 12a8 8 0 0 1-11.6 7.1L3 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9 9.5c.3 2.3 2.2 4.2 5 5l1.2-1.4-1.9-1-.8.7c-.7-.3-1.5-1.1-1.8-1.8l.7-.8-1-1.9z"/>'),
  mail: svgPath('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  instagram: svgPath('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/>'),
  tiktok: svgPath('<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.6 2 4.3 5 4.5"/>'),
  threads: svgPath('<path d="M12 21c5 0 8-3.2 8-9s-3-9-8-9-8 3.2-8 9"/><path d="M8.4 14.5c.6 1.6 2 2.4 3.7 2.4 2.2 0 3.6-1.3 3.6-3.1 0-2-1.6-3.3-4-3.3-1.6 0-2.9.7-3.3 1.7"/>'),
  youtube: svgPath('<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.5 9.5l4.5 2.5-4.5 2.5z"/>'),
  linkedin: svgPath('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.5 10.5V17M7.5 7.4v.1M11.5 17v-3.6a2 2 0 0 1 4 0V17"/>'),
  github: svgPath('<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>'),
  cert: svgPath('<circle cx="12" cy="9" r="6"/><path d="M8.5 14.2L7 22l5-3 5 3-1.5-7.8"/>'),
  copy: svgPath('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>'),
  share: svgPath('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>'),
  download: svgPath('<path d="M12 3v12m0 0l-4-4m4 4l4-4M4 20h16"/>'),
  search: svgPath('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
  open: svgPath('<path d="M7 17L17 7M8 7h9v9"/>'),
  star: svgPath('<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>'),
};

/** Icon rendered as a React SVG (no dangerouslySetInnerHTML on the root). */
export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const inner = (ICONS[name] ?? ICONS.web)
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>$/, '');
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}

/* ---------- clipboard ---------- */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const t = document.createElement('textarea');
    t.value = text;
    t.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(t);
    t.select();
    try {
      document.execCommand('copy');
    } catch {
      /* ignore */
    }
    t.remove();
    return false;
  }
}

