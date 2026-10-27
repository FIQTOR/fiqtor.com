import { useCallback, useEffect, useRef, useState } from 'react';
import { isReducedMotion } from '../lib/utils';

/**
 * Reveal-on-scroll — the React replacement for a global
 * `IntersectionObserver` that adds `.in` to every `.rv` in a root.
 * Elements inside the root that appear later (e.g. after a filter change)
 * are picked up by re-running the observer when `deps` change.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null);
  const reduced = useRef(isReducedMotion());
  const scanRef = useRef<(() => void) | null>(null);
  /**
   * Nodes this hook has already revealed.
   *
   * React does not know about a class added with `classList.add('in')`: when it
   * next writes `className` on that element — any re-render of a component
   * whose class string is computed from state, e.g. an FAQ row being opened —
   * it writes the list it *thinks* the node has and `in` disappears. Then
   * `html.js .rv` hides the element again: exactly why career cards and the
   * homepage FAQ answer vanished on click.
   *
   * Remembering the revealed nodes lets the hook repair that after any render.
   * A `Set` (not `WeakSet`) because it has to be iterated; nodes are dropped
   * when they leave the document so the set cannot grow without bound.
   */
  const revealed = useRef(new Set<Element>());

  const restore = useCallback(() => {
    if (reduced.current) return;
    revealed.current.forEach((el) => {
      if (!el.isConnected) {
        revealed.current.delete(el);
        return;
      }
      if (!el.classList.contains('in')) el.classList.add('in');
    });
  }, []);

  // Runs after every render of the owning component. Cheap: it only touches
  // nodes that React actually un-revealed.
  useEffect(restore);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (reduced.current) {
      root.querySelectorAll('.rv').forEach((el) => {
        el.classList.add('in');
        revealed.current.add(el);
      });
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        visible.forEach((en, k) => {
          (en.target as HTMLElement).style.setProperty('--d', (k * 0.09).toFixed(2) + 's');
          en.target.classList.add('in');
          // Remember it so a later re-render cannot silently un-reveal it.
          revealed.current.add(en.target);
          io.unobserve(en.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    const scan = () =>
      root.querySelectorAll('.rv:not(.in)').forEach((el) => {
        // Already revealed once: React just dropped the class, so put it back
        // rather than re-observing (which would replay the fade-in).
        if (revealed.current.has(el)) {
          el.classList.add('in');
          return;
        }
        io.observe(el);
      });
    scan();
    scanRef.current = scan;
    return () => {
      io.disconnect();
      scanRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/**
 * Interactive title: letters rise in one-by-one on scroll and then follow the
 * cursor (each `--f` drives a CSS transform). Used for every big heading.
 */
export function InteractiveTitle({
  text,
  as: Tag = 'h2',
  className = '',
}: {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = isReducedMotion();
  const [state, setState] = useState<{ in: boolean; done: boolean }>(() =>
    reduced ? { in: true, done: true } : { in: false, done: false },
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            setState((s) => (s.in ? s : { in: true, done: false }));
            io.disconnect();
          }
        }),
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const charCount = Array.from(text.replace(/\s+/g, ' ')).length;
  useEffect(() => {
    if (!state.in) return;
    const t = setTimeout(() => setState((s) => (s.done ? s : { ...s, done: true })), 1000 + charCount * 22);
    return () => clearTimeout(t);
  }, [state.in, charCount]);

  // Letters drift away from the cursor once the intro has settled.
  useEffect(() => {
    if (!state.done) return;
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const el = ref.current;
    if (!el) return;
    let pending = false;
    const onMove = (e: PointerEvent) => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const b = el.getBoundingClientRect();
        const chars = el.querySelectorAll<HTMLElement>('.tc');
        if (
          e.clientX < b.left - 180 ||
          e.clientX > b.right + 180 ||
          e.clientY < b.top - 180 ||
          e.clientY > b.bottom + 180
        ) {
          chars.forEach((c) => c.style.setProperty('--f', '0'));
          return;
        }
        chars.forEach((c) => {
          const r = c.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          c.style.setProperty('--f', Math.max(0, 1 - Math.hypot(dx, dy) / 150).toFixed(2));
        });
      });
    };
    addEventListener('pointermove', onMove, { passive: true });
    return () => removeEventListener('pointermove', onMove);
  }, [state.done]);

  const words = text.trim().replace(/\s+/g, ' ').split(/(\s+)/).filter(Boolean);
  const cls = ['tt', state.in ? 'in' : '', state.done ? 'done' : '', className].filter(Boolean).join(' ');

  const parts = words.reduce<{ space: boolean; key: string; base: number; chars: string[] }[]>((list, tok, n) => {
    const used = list.reduce((sum, p) => sum + p.chars.length, 0);
    if (/^\s+$/.test(tok)) list.push({ space: true, key: 's' + n, base: -1, chars: [] });
    else list.push({ space: false, key: tok + used, base: used, chars: Array.from(tok) });
    return list;
  }, []);

  return (
    <Tag ref={ref as never} className={cls} aria-label={text.trim()}>
      {parts.map((part) =>
        part.space ? (
          <span key={part.key}> </span>
        ) : (
          <span className="tw" key={part.key} aria-hidden="true">
            {part.chars.map((ch, j) => (
              <span className="tc" key={j} style={{ ['--i' as string]: part.base + j }}>
                {ch}
              </span>
            ))}
          </span>
        ),
      )}
    </Tag>
  );
}

/** Number that counts up when it scrolls into view. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = isReducedMotion();
  const [n, setN] = useState(() => (reduced ? value : 0));

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / 1500);
          setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, reduced]);

  return (
    <span ref={ref} className={className}>
      {n}
    </span>
  );
}

/** Footer clock, ticked every 15 seconds. */
export function useLocalClock(tz: string, label: string) {
  const fmt = useCallback(() => {
    const f = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz });
    return f.format(new Date()).replace('.', ':') + ' ' + label;
  }, [tz, label]);
  const [txt, setTxt] = useState<string>(() => fmt());
  useEffect(() => {
    const id = setInterval(() => setTxt(fmt()), 15000);
    return () => clearInterval(id);
  }, [fmt]);
  return txt;
}

/**
 * Alternating typewriter used in the hero and on the Linktree page.
 *
 * The dependency is a JOINED KEY, not the array. Callers pass an inline
 * `[a, b, c]` literal, so the array identity changes on every render; using it
 * as the dep tore down and restarted the animation on each keystroke, which
 * reset the counter to zero and made the text flicker between one character
 * and nothing. The key only changes when the CONTENT does (e.g. a language
 * switch), which is exactly when a restart is wanted.
 */
export function useTypewriter(words: string[]): string {
  const key = words.join('\u0000');
  const reduced = isReducedMotion();
  const [txt, setTxt] = useState<string>(() => (reduced ? (words[0] ?? '') : ''));

  useEffect(() => {
    if (isReducedMotion()) return;
    const list = key.split('\u0000');
    if (list.length === 0 || (list.length === 1 && list[0] === '')) return;
    let wi = 0;
    let ci = 0;
    let del = false;
    let timer = 0;
    const tick = () => {
      const w = list[wi] ?? '';
      ci += del ? -1 : 1;
      setTxt(w.slice(0, ci));
      let d = del ? 35 : 70;
      if (!del && ci === w.length) {
        del = true;
        d = 1600;
      } else if (del && ci === 0) {
        del = false;
        wi = (wi + 1) % list.length;
        d = 320;
      }
      timer = window.setTimeout(tick, d);
    };
    timer = window.setTimeout(tick, 120);
    return () => clearTimeout(timer);
  }, [key]);

  /**
   * Reduced motion has no animation, so the line must simply BE the first word
   * of the current language list. Reading it at render time (rather than
   * relying on `txt`) is what keeps a language switch from leaving the line
   * blank: the effect above bails out under reduced motion, so `txt` would
   * otherwise keep the previous language's value (or `''` on first mount).
   */
  return reduced ? (words[0] ?? '') : txt;
}

/** Tracks whether the page has scrolled past `threshold` px. */
export function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}
