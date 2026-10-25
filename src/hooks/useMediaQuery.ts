import { useEffect, useState } from 'react';

/**
 * Subscribe to a CSS media query from React.
 *
 * Deliberately NOT `useSyncExternalStore`: that needs a stable server snapshot
 * and this app is client-rendered, so a plain `useState` seeded from
 * `matchMedia` is both simpler and correct — the first render already has the
 * real answer, which avoids rendering the desktop count for one frame on a
 * phone and then swapping.
 *
 * `isReducedMotion()`-style environments without `matchMedia` (older embedded
 * webviews, some test runners) fall back to `false` rather than throwing.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof matchMedia !== 'function') return false;
    try {
      return matchMedia(query).matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    let mq: MediaQueryList;
    try {
      mq = matchMedia(query);
    } catch {
      return;
    }
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    // The initial value already came from `matchMedia` in `useState`, so this
    // effect only needs to subscribe — reading it again here would set state
    // during the effect and cost a second render for nothing.
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/**
 * The site's mobile breakpoint, matching `@media (max-width:900px)` in
 * `site.css` — keep the two in sync.
 */
export const MOBILE_QUERY = '(max-width:900px)';

export const useIsMobile = () => useMediaQuery(MOBILE_QUERY);
