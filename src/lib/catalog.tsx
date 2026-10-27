import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { S, type CatalogItem } from '../data/site';

/* =====================================================================
   Catalog (projects & certificates) + detail modal + lightbox state.
   ===================================================================== */

export type CatalogType = 'project' | 'cert';
export interface CatalogRef {
  type: CatalogType;
  i: number;
}

interface CatalogCtx {
  cur: CatalogRef | null;
  open: (type: CatalogType, i: number) => void;
  openFromCard: (type: CatalogType, i: number, id: string, list?: CatalogItem[]) => void;
  /** Items currently in the modal's step sequence (filtered on the cert page). */
  list: CatalogItem[];
  close: () => void;
  step: (d: 1 | -1) => void;
}

const Ctx = createContext<CatalogCtx | null>(null);

export const useCatalog = (): CatalogCtx => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCatalog must be used inside <CatalogProvider>');
  return c;
};

/** Find the index of a catalog entry by its slug id. */
export const findCatalogIndex = (items: CatalogItem[], id: string): number =>
  items.findIndex((x) => x.id === id);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [cur, setCur] = useState<CatalogRef | null>(null);
  /**
   * The list the modal steps through. Cards must pass the list they are
   * actually rendering (the certificate page filters and groups), otherwise
   * next/prev would jump to items the visitor cannot see.
   */
  const [list, setList] = useState<CatalogItem[]>([]);
  const historyPushed = useRef(false);

  const open = useCallback((type: CatalogType, i: number, items?: CatalogItem[]) => {
    setList(items ?? (type === 'project' ? S.projects : S.certs));
    setCur({ type, i });
    document.body.classList.add('nosc');
  }, []);

  const close = useCallback(() => {
    setCur(null);
    document.body.classList.remove('nosc');
    // The history entry pushed by `openFromCard` is gone once the modal closes
    // (Back consumed it, or the visitor clicked ×). Reset the flag so the NEXT
    // open pushes a fresh entry — otherwise a deep link opened after a manual
    // close would skip `pushState` and Back would leave the page instead of
    // closing the modal.
    historyPushed.current = false;
  }, []);

  /** Push a history entry first, so the browser Back button closes the modal. */
  const openFromCard = useCallback(
    (type: CatalogType, i: number, id: string, items?: CatalogItem[]) => {
      if (!historyPushed.current) {
        historyPushed.current = true;
        try {
          history.pushState({ catalog: true }, '', '#' + id);
        } catch {
          /* ignore (e.g. file://) */
        }
      }
      open(type, i, items);
    },
    [open],
  );

  // Browser Back: close the modal instead of navigating away.
  useEffect(() => {
    const onPop = () => {
      if (historyPushed.current) {
        historyPushed.current = false;
        close();
      }
    };
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, [close]);

  const step = useCallback(
    (d: 1 | -1) => {
      setCur((c) => {
        if (!c) return c;
        const n = (list.length || (c.type === 'project' ? S.projects.length : S.certs.length));
        return { ...c, i: (c.i + d + n) % n };
      });
    },
    [list.length],
  );

  // The chat assistant (and anything else) can request a modal item.
  useEffect(() => {
    const h = (e: Event) => {
      const d = (e as CustomEvent<{ type: CatalogType; i: number }>).detail;
      open(d.type, d.i);
    };
    document.addEventListener('open-catalog-item', h);
    return () => document.removeEventListener('open-catalog-item', h);
  }, [open]);

  // Deep links: /projects#slug or /certificates#slug
  useEffect(() => {
    let timer = 0;
    const check = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      if (!h) return;
      const pi = findCatalogIndex(S.projects, h);
      if (pi > -1) {
        // Pass the full list explicitly: the index came from `S.projects`, so
        // the modal must step through the same array or next/prev desyncs.
        openFromCard('project', pi, h, S.projects);
        return;
      }
      const ci = findCatalogIndex(S.certs, h);
      if (ci > -1) openFromCard('cert', ci, h, S.certs);
    };
    timer = window.setTimeout(check, 350);
    // React Router keeps the DOM node across route changes, so listen for hash
    // clicks too (e.g. shared links opened while already on the page).
    addEventListener('hashchange', check);
    return () => {
      clearTimeout(timer);
      removeEventListener('hashchange', check);
    };
  }, [openFromCard]);

  // ESC closes, arrows step, while the modal is open.
  useEffect(() => {
    if (!cur) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      const inField = (e.target as HTMLElement | null)?.closest('input,textarea');
      if (!inField && e.key === 'ArrowRight') step(1);
      if (!inField && e.key === 'ArrowLeft') step(-1);
    };
    addEventListener('keydown', h);
    return () => removeEventListener('keydown', h);
  }, [cur, close, step]);

  const value = useMemo(
    () => ({ cur, open, openFromCard, close, step, list }),
    [cur, open, openFromCard, close, step, list],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* ---------------------------------------------------------------------
   Language
   --------------------------------------------------------------------- */

export type Language = 'en' | 'id';

interface LangCtx {
  lang: Language;
  setLang: (l: Language) => void;
  toggle: () => void;
}

const LangContext = createContext<LangCtx | null>(null);

const LANG_KEY = 'fiqtor.lang';

const readLang = (): Language => {
  // 1. `?lang=id` — the target of the hreflang alternate links, so a crawler
  //    or a shared link opens the Indonesian version deterministically.
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'id') return q;
  } catch {
    /* ignore */
  }
  // 2. The visitor's explicit choice.
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'id') return saved;
  } catch {
    /* ignore */
  }
  // 3. Browser language, then English.
  if (typeof navigator !== 'undefined' && /^id\b/i.test(navigator.language)) return 'id';
  return 'en';
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(readLang);

  /**
   * Switch language AND mirror it into the URL (`?lang=id`).
   *
   * Without this the choice only lived in `localStorage`, so a link copied
   * from an Indonesian session opened in Indonesian for everyone else. The
   * parameter is read on boot (see `readLang`) and stripped again as soon as
   * the visitor navigates, so it never pollutes the canonical URL.
   *
   * A `history.replaceState` is used (not a router navigation) to keep the
   * current scroll position and avoid a page transition.
   */
  const setLang = useCallback((l: Language) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = l;
    try {
      const u = new URL(window.location.href);
      // English is the x-default; it needs no parameter.
      if (l === 'en') u.searchParams.delete('lang');
      else u.searchParams.set('lang', l);
      const qs = u.searchParams.toString();
      history.replaceState(history.state, '', u.pathname + (qs ? `?${qs}` : '') + u.hash);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  /**
   * `?lang=` is kept in the URL while it is valid — it is how a visitor shares
   * (or bookmarks) the Indonesian view of a page, and it is what the EN/ID
   * switch writes. It is *not* a canonical/duplicate concern: `<head>`
   * publishes only `x-default`, so search engines already treat every path as
   * one document and `?lang=id` adds no indexable variant.
   *
   * It is dropped when it is meaningless, so the address bar a client copies
   * after clicking around never carries noise.
   */
  useEffect(() => {
    try {
      const u = new URL(window.location.href);
      const q = u.searchParams.get('lang');
      if (q === 'en' || q === 'id') return;
      if (!u.searchParams.has('lang')) return;
      u.searchParams.delete('lang');
      history.replaceState(history.state, '', u.pathname + (u.search || '') + u.hash);
    } catch {
      /* ignore */
    }
  }, []);

  /**
   * Keep the language stamp in sync across in-app navigation: a visitor who
   * switched to Indonesian expects the next page they open to stay Indonesian,
   * and the URL should say so. An `en` visitor gets a clean path (English is
   * the `x-default`).
   *
   * `replace` is used so this never grows the history stack, and the guard on
   * the *current* value makes the effect a no-op when the URL already agrees.
   */
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* ignore */
    }
    const params = new URLSearchParams(location.search);
    const current = params.get('lang');
    const want = lang === 'en' ? null : lang;
    if (current === want) return;
    if (want) params.set('lang', want);
    else params.delete('lang');
    const qs = params.toString();
    navigate(
      { pathname: location.pathname, search: qs ? `?${qs}` : '', hash: location.hash },
      { replace: true },
    );
    // Reacts only to navigation; `lang` is read, not tracked, so a manual URL
    // edit is not immediately overwritten by a stale render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, location.hash]);

  const toggle = useCallback(() => setLang(lang === 'en' ? 'id' : 'en'), [lang, setLang]);
  const value = useMemo(() => ({ lang, setLang, toggle }), [lang, setLang, toggle]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLanguage = (): LangCtx => {
  const c = useContext(LangContext);
  if (!c) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return c;
};
