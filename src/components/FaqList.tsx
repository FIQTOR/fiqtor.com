import { useEffect, useRef, useState } from 'react';
import { S } from '../data/site';
import { useLanguage } from '../lib/catalog';
import { isReducedMotion } from '../lib/utils';

/**
 * Collapsible FAQ list.
 *
 * Behaviour is identical everywhere it appears (one open at a time, first item
 * open by default so the block never looks like a row of dead buttons), so it
 * lives here instead of being reimplemented per page. The `compact` flag trims
 * the homepage teaser to the questions that most often decide an enquiry.
 *
 * IMPORTANT — reveal classes are React state, not `classList`.
 * `useReveal` marks `.rv` nodes by calling `el.classList.add('in')` directly.
 * That was silently undone here: the row's own `className` is computed from
 * `isOpen`, so the next render rewrote it as `"fq rv open"` — dropping `in` —
 * and `html.js .rv{opacity:0}` snapped the row back to invisible. On the
 * homepage the opened question simply disappeared, exactly like the career
 * cards before them. `in` is therefore owned by this component; the reveal is
 * driven by one shared scroll handler instead of the hook.
 */
export function FaqList({ limit, compact = false }: { limit?: number; compact?: boolean }) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);
  const items = limit ? S.faq.slice(0, limit) : S.faq;
  const listRef = useRef<HTMLDivElement>(null);
  /** Indices already revealed. Seeded for reduced motion so nothing is blank. */
  const [seen, setSeen] = useState<Set<number>>(() =>
    isReducedMotion() ? new Set(items.map((_, i) => i)) : new Set(),
  );

  useEffect(() => {
    const root = listRef.current;
    if (!root || isReducedMotion()) return;

    const upd = () => {
      const next = new Set<number>();
      root.querySelectorAll<HTMLElement>('.fq').forEach((el, i) => {
        if (el.getBoundingClientRect().top < innerHeight * 0.92) next.add(i);
      });
      // Commit only on change — a scroll frame must not re-render the list.
      setSeen((prev) => (prev.size === next.size && [...next].every((i) => prev.has(i)) ? prev : next));
    };

    // Start on the next frame so the first measurement happens after layout.
    const raf = requestAnimationFrame(upd);
    addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', upd);
      removeEventListener('resize', upd);
    };
    // `items` is derived from `limit`; re-observe when the list length changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  return (
    <div className={'faq' + (compact ? ' faq-compact' : '')} ref={listRef}>
      {items.map((q, i) => {
        const isOpen = open === i;
        return (
          <div
            className={'fq rv' + (seen.has(i) ? ' in' : '') + (isOpen ? ' open' : '')}
            key={q.q.en}
            style={{ ['--d' as string]: `${(i * 0.06).toFixed(2)}s` }}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`fq-bd-${i}`}
              id={`fq-h-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{q.q[lang]}</span>
              <span className="pl" aria-hidden="true">
                +
              </span>
            </button>
            <div className="bd" id={`fq-bd-${i}`} role="region" aria-labelledby={`fq-h-${i}`}>
              <div>
                <p>{q.a[lang]}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
