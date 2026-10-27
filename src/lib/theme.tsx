import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/* =====================================================================
   THEME — dark (default) / light monochrome.
   ---------------------------------------------------------------------
   The whole visual system is monochrome, so switching theme means swapping
   a small set of CSS custom properties (`html[data-theme="light"]` in
   site.css). Nothing else in the app needs to know about it.

   - Dark is the default (no `prefers-color-scheme` sniffing on the first
     visit: the brand is a dark canvas).
   - The choice is stored in localStorage and applied by an inline script in
     index.html BEFORE first paint, so there is no white flash on reload.
   ===================================================================== */

import { THEME_STORAGE_KEY as THEME_KEY } from './themeBoot';

export type Theme = 'dark' | 'light';

export const readTheme = (): Theme => {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
  // The mobile browser UI follows these meta tags. The prerendered <head>
  // ships TWO `theme-color` metas (one per `prefers-color-scheme`), so the
  // choice must be written to BOTH: `querySelector` alone only reached the
  // dark one and left a light-mode visitor with a black system toolbar.
  const color = theme === 'dark' ? '#000000' : '#ffffff';
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    meta.content = color;
  });
};

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readTheme);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      /* private mode — the theme still applies for this session */
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Follow the OS only when the visitor has never made an explicit choice.
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch {
      /* ignore */
    }
    if (stored) return;
    const mq = matchMedia('(prefers-color-scheme: light)');
    const on = () => setTheme(mq.matches ? 'light' : 'dark');
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [setTheme]);

  const toggle = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme]);
  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useTheme = (): ThemeCtx => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useTheme must be used inside <ThemeProvider>');
  return c;
};
