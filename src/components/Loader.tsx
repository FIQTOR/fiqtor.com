import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useOutlet } from 'react-router-dom';
import { isReducedMotion, wait } from '../lib/utils';

/* =====================================================================
   Initial loader + page transition (column curtain).
   ---------------------------------------------------------------------
   The rules below exist because a broken loader is far worse than none:

   1. The loader shows ONCE per tab session (sessionStorage `seen`).
   2. `ready` starts `true` whenever nothing is being awaited, so a plain
      refresh never leaves the hero waiting for an event that won't fire.
   3. The click listener runs in the CAPTURE phase — React Router's <Link>
      calls preventDefault()/navigate() on bubble, and a bubble listener
      would never see the click before the route changed.
   4. `busy` is always released (including on error) so navigation can
      never be swallowed permanently.
   ===================================================================== */

const EASE = 'cubic-bezier(.76,0,.24,1)';
let loaderDone = false;

const ss = {
  get(k: string) {
    try {
      return sessionStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k: string, v: string | null) {
    try {
      if (v === null) sessionStorage.removeItem(k);
      else sessionStorage.setItem(k, v);
    } catch {
      /* ignore */
    }
  },
};

export const LABELS: Record<string, string> = {
  '/': 'Home',
  '/projects': 'Projects',
  '/certificates': 'Certificates',
  '/career': 'Career',
  '/contact': 'Contact',
  '/linktree': 'Linktree',
};

type Phase = 'loading' | 'arriving' | 'idle';

export function PageShell({ children, onlyHistory = false }: { children: React.ReactNode; onlyHistory?: boolean }) {
  const navigate = useNavigate();
  const outlet = useOutlet();
  const RM = isReducedMotion();

  const initialPhase: Phase = (() => {
    if (onlyHistory || RM) return 'idle';
    if (ss.get('pt')) return 'arriving';
    if (!ss.get('seen') && !loaderDone) return 'loading';
    return 'idle';
  })();

  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [ready, setReady] = useState(initialPhase === 'idle');
  const [label, setLabel] = useState(() => ss.get('pt') ?? '');
  const [visible, setVisible] = useState(initialPhase !== 'idle');
  const [switching, setSwitching] = useState(false);
  const [pct, setPct] = useState(0);

  const busy = useRef(false);
  const busySince = useRef(0);
  const activeAnims = useRef<Animation[]>([]);
  const colsRef = useRef<HTMLDivElement>(null);
  const ldRef = useRef<HTMLDivElement>(null);
  const lblRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);

  const fireReadyRef = useRef<() => void>(() => {});
  fireReadyRef.current = () => {
    setReady(true);
    document.documentElement.classList.add('hero-ready');
  };
  const fireReady = () => fireReadyRef.current();

  const cols = () => (colsRef.current ? (Array.from(colsRef.current.children) as HTMLElement[]) : []);

  const done = useCallback(() => {
    setVisible(false);
    setPhase('idle');
    setSwitching(false);
    busy.current = false;
    ss.set('pt', null);
    document.documentElement.classList.remove('ld');
    document.body.classList.remove('nosc');
  }, []);

  /* ---------- initial loader ---------- */
  useEffect(() => {
    if (phase !== 'loading' || onlyHistory) {
      document.documentElement.classList.remove('ld');
      return;
    }
    if (RM) {
      fireReady();
      setVisible(false);
      setPhase('idle');
      document.documentElement.classList.remove('ld');
      return;
    }
    document.documentElement.classList.add('ld');
    document.body.classList.add('nosc');
    // The pre-paint boot script locks scrolling before React is even parsed.
    // If this effect never runs (bundle blocked, chunk error, tab throttled),
    // the visitor would be stuck on an unlocked-but-unusable page forever.
    // A watchdog — not a timer we rely on for the happy path — guarantees the
    // lock is released even when nothing else here gets a chance to run.
    const unlock = window.setTimeout(() => {
      document.documentElement.classList.remove('ld');
      document.body.classList.remove('nosc');
    }, 12000);
    const t0 = performance.now();
    let loaded = document.readyState === 'complete';
    const onLoad = () => {
      loaded = true;
    };
    addEventListener('load', onLoad);

    let raf = 0;
    let cancelled = false;

    const curtainUp = async () => {
      cols().forEach((c) => (c.style.transformOrigin = 'top'));
      await Promise.all(
        cols().map((c, i) => {
          const a = c.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], {
            duration: 800,
            delay: i * 65,
            easing: EASE,
            fill: 'forwards',
          });
          activeAnims.current.push(a);
          return a.finished.catch(() => undefined);
        }),
      );
      if (cancelled) return;
      loaderDone = true;
      ss.set('seen', '1');
      done();
    };

    const finish = async () => {
      setPct(100);
      if (barRef.current) barRef.current.style.transform = 'scaleX(1)';
      await wait(280);
      if (cancelled) return;
      if (ldRef.current) {
        const a = ldRef.current.animate(
          [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-36px)' }],
          { duration: 480, easing: 'ease', fill: 'forwards' },
        );
        activeAnims.current.push(a);
        await a.finished.catch(() => undefined);
      }
      if (cancelled) return;
      fireReady();
      await curtainUp();
    };

    const tick = () => {
      const t = performance.now() - t0;
      const tp = Math.min(1, t / 1600);
      const e = 1 - Math.pow(1 - tp, 3);
      const p = Math.min(e, loaded ? 1 : 0.92);
      setPct(Math.round(p * 100));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (cancelled) return;
      if (p >= 1 || t > 7000) {
        void finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(unlock);
      removeEventListener('load', onLoad);
      activeAnims.current.forEach((a) => {
        try {
          a.cancel();
        } catch {
          /* ignore */
        }
      });
      activeAnims.current = [];
      document.documentElement.classList.remove('ld');
      document.body.classList.remove('nosc');
      // A remounted loader must be able to run from scratch again.
      if (!loaderDone) ss.set('seen', null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* ---------- arrival (after a curtain went up) ---------- */
  useEffect(() => {
    if (phase !== 'arriving') return;
    if (RM) {
      setVisible(false);
      setPhase('idle');
      fireReady();
      return;
    }
    const lbl = lblRef.current;
    if (lbl) {
      lbl.textContent = label;
      void lbl
        .animate(
          [
            { opacity: 1, transform: 'translate(-50%,-50%)' },
            { opacity: 0, transform: 'translate(-50%,-80%)' },
          ],
          { duration: 420, easing: 'ease', fill: 'forwards' },
        )
        .finished.catch(() => undefined);
    }
    const readyTimer = window.setTimeout(fireReady, 330);
    const go = async () => {
      await wait(320);
      cols().forEach((c) => (c.style.transformOrigin = 'top'));
      await Promise.all(
        cols().map((c, i) =>
          c
            .animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], {
              duration: 800,
              delay: i * 65,
              easing: EASE,
              fill: 'forwards',
            })
            .finished.catch(() => undefined),
        ),
      );
      done();
    };
    void go();
    return () => clearTimeout(readyTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* ---------- navigate with the curtain ---------- */
  const goRef = useRef<(to: string, label: string) => Promise<void>>(async () => {});
  goRef.current = async (to, lblText) => {
    ss.set('pt', lblText);
    setLabel(lblText);
    setVisible(true);
    setSwitching(true);
    document.body.classList.add('nosc');
    cols().forEach((c) => (c.style.transformOrigin = 'bottom'));

    const cover = Promise.all(
      cols().map((c, i) =>
        c
          .animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], {
            duration: 620,
            delay: i * 55,
            easing: EASE,
            fill: 'forwards',
          })
          .finished.catch(() => undefined),
      ),
    );

    await wait(180);
    const lbl = lblRef.current;
    if (lbl) {
      lbl.textContent = lblText;
      void lbl
        .animate(
          [
            { opacity: 0, transform: 'translate(-50%,-20%)' },
            { opacity: 1, transform: 'translate(-50%,-50%)' },
          ],
          { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' },
        )
        .finished.catch(() => undefined);
    }

    await cover;
    await wait(260);
    setPhase('arriving');
    navigate(to, { state: { skipLoader: true } });
    // `switching` stays on until the arrival effect finishes, so there is no
    // one-frame flash of the new page behind the curtain.
  };

  /* ---------- intercept internal links ---------- */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (RM) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.dataset.open !== undefined) return;
      if (a.hasAttribute('data-no-transition')) return;

      let u: URL;
      try {
        u = new URL(a.href, location.href);
      } catch {
        return;
      }
      if (u.protocol !== location.protocol || u.host !== location.host) return;

      const same = u.pathname === location.pathname && u.search === location.search;
      if (same) {
        if (u.hash) return; // in-page anchor: keep native behaviour
        e.preventDefault();
        scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      e.preventDefault();
      // Stop React Router's own bubble-phase handler from navigating early.
      e.stopImmediatePropagation();
      if (busy.current) {
        // Safety valve: a stuck transition must never lock navigation forever.
        if (performance.now() - busySince.current < 4500) return;
      }
      busy.current = true;
      busySince.current = performance.now();
      void goRef.current(u.pathname + u.search + u.hash, LABELS[u.pathname] || 'Loading');
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [RM]);

  /* ---------- bfcache restore ---------- */
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        busy.current = false;
        setVisible(false);
        setPhase('idle');
        fireReady();
      }
    };
    addEventListener('pageshow', onShow);
    return () => removeEventListener('pageshow', onShow);
  }, []);

  // The shell (and therefore the Outlet) is never unmounted — only the
  // overlay is toggled — so the hero's intro animation is not lost.
  const showLoader = phase === 'loading';
  const showCols = visible || switching;

  return (
    <>
      <div
        className={'pt' + (showCols ? ' on' : '') + (showLoader ? ' ld' : '')}
        aria-hidden="true"
        style={{ display: showCols ? 'block' : 'none', pointerEvents: switching ? 'auto' : 'none' }}
      >
        <div className="pt-cols" ref={colsRef}>
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="pt-lbl" ref={lblRef} style={{ opacity: phase === 'arriving' ? 1 : 0 }}>
          {phase === 'arriving' ? label : ''}
        </div>
        {showLoader ? (
          <div className="pt-ld" ref={ldRef} style={{ display: 'flex' }}>
            {/* Just the name, set as type: centred, bold, no artwork. The
                raster mark and the dot-matrix canvas both only delayed the
                first paint to say what this one line says. */}
            <b className="pt-name">FIQTOR</b>
            <div className="pt-meta">
              <span>Loading portfolio</span>
              <b>
                <span>{pct}</span>
                <small>%</small>
              </b>
            </div>
          </div>
        ) : null}
        <div className="pt-bar">
          <i ref={barRef} />
        </div>
      </div>
      <OutletContext.Provider value={ready}>{children ?? outlet}</OutletContext.Provider>
    </>
  );
}

const OutletContext = createContext<boolean>(false);

/** True once the loader/transition has finished — hero intro waits on this. */
export const usePageStarted = () => useContext(OutletContext);
