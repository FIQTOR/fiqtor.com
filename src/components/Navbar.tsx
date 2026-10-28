import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { S } from '../data/site';
import { useLanguage } from '../lib/catalog';
import { ThemeSwitch } from './ThemeSwitch';
import { Brand } from './Logo';
import { Icon, type IconName } from '../lib/utils.tsx';

/**
 * Primary navigation. `icon` is optional: an entry with an icon renders as a
 * compact icon button instead of a text link (Linktree sits beside the theme
 * switch so it reads as "all my profiles" rather than a sixth page).
 */
const MENU: Array<{ to: string; label: { en: string; id: string; zh?: string }; icon?: IconName }> = [
  { to: '/', label: { en: 'Home', id: 'Beranda', zh: '首页' } },
  { to: '/projects', label: { en: 'Projects', id: 'Proyek', zh: '项目' } },
  { to: '/career', label: { en: 'Career', id: 'Karier', zh: '经历' } },
  { to: '/certificates', label: { en: 'Certificates', id: 'Sertifikat', zh: '证书' } },
  { to: '/contact', label: { en: 'Contact', id: 'Kontak', zh: '联系' } },
  { to: '/linktree', label: { en: 'Linktree', id: 'Linktree', zh: '社交链接' }, icon: 'linktree' },
];

/** Three-state language switch (EN / ID / 中文). */
export function LanguageSwitch() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="lang-sw" role="group" aria-label="Language / Bahasa / 语言">
      <button type="button" className={lang === 'en' ? 'on' : ''} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
        EN
      </button>
      <button type="button" className={lang === 'id' ? 'on' : ''} aria-pressed={lang === 'id'} onClick={() => setLang('id')}>
        ID
      </button>
      <button type="button" className={lang === 'zh' ? 'on' : ''} aria-pressed={lang === 'zh'} onClick={() => setLang('zh')}>
        中文
      </button>
    </div>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const ly = useRef(0);
  const pillRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLElement>(null);
  const loc = useLocation();
  const { lang } = useLanguage();
  const open = menuOpen;

  useEffect(() => {
    const onScroll = () => {
      const y = scrollY;
      setScrolled(y > 40);
      setHidden(y > ly.current && y > 320 && !open);
      ly.current = y;
      const pr = document.querySelector<HTMLElement>('.progress');
      if (pr) pr.style.transform = `scaleX(${y / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, [open]);

  useEffect(() => {
    document.body.classList.toggle('nosc', open);
    return () => document.body.classList.remove('nosc');
  }, [open]);

  /**
   * Close the drawer on every navigation.
   *
   * The links already call `setMenuOpen(false)` in `onClick`, but that only
   * covers a tap that actually lands on the link. Any other way the route can
   * change — the browser Back button, a redirect, the footer's "Let's talk",
   * the brand logo, a keyboard Enter on a focused link — used to leave
   * `menuOpen` true. The drawer stayed on screen AND `body.nosc`
   * (`overflow:hidden`) stayed applied, so the new page could not be
   * scrolled: it looked like the site had frozen after picking a menu item.
   *
   * Keying on `loc.pathname` makes the route the single source of truth for
   * "a navigation happened", so the drawer cannot outlive the page it was
   * opened on. Re-opening the same route intentionally does not fire this
   * (pathname is unchanged), which is correct — the drawer is already closed
   * in that case because the user just tapped the link.
   */
  useEffect(() => {
    setMenuOpen(false);
  }, [loc.pathname]);

  // Also drop the lock if the viewport grows past the mobile breakpoint while
  // the drawer is open (rotate to landscape, resize a window): the burger and
  // the drawer are both hidden there, so a leftover `nosc` would silently
  // block scrolling on desktop with no visible way to clear it.
  useEffect(() => {
    if (!open) return;
    const mq = matchMedia('(min-width: 901px)');
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    addEventListener('keydown', h);
    return () => removeEventListener('keydown', h);
  }, [open]);

  /**
   * Move the highlight pill under a nav link.
   *
   * Fixes the "rounded active area jumps back to the old link" bug: the pill
   * position was only re-measured on route/language change, so after clicking
   * a link the DOM updated the `a.on` class but the pill kept the old offset
   * until the next layout event. It is now re-measured whenever the active
   * link actually changes, whenever the navbar resizes, and whenever fonts
   * finish loading (labels change width).
   */
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  const movePill = useCallback((a: HTMLElement | null) => {
    const pill = pillRef.current;
    if (!pill) return;
    if (!a || a.offsetWidth === 0) {
      pill.style.opacity = '0';
      pill.style.width = '0px';
      return;
    }
    pill.style.left = a.offsetLeft + 'px';
    pill.style.width = a.offsetWidth + 'px';
    // Only fade in once a width exists, otherwise the first paint animates
    // from the far left edge.
    requestAnimationFrame(() => {
      if (pillRef.current === pill) pill.style.opacity = '1';
    });
  }, []);

  // Re-measure the highlight after every navigation (the active link changed).
  // A double rAF waits for the new layout, including the router's own update.
  useEffect(() => {
    const L = linksRef.current;
    if (!L) return;
    activeRef.current = null;
    const sync = () => {
      const a = L.querySelector<HTMLAnchorElement>('a.on');
      activeRef.current = a;
      movePill(a);
    };
    sync();
    const r1 = requestAnimationFrame(() => {
      sync();
      requestAnimationFrame(sync);
    });
    const t = window.setTimeout(sync, 120);
    return () => {
      cancelAnimationFrame(r1);
      clearTimeout(t);
    };
    // `movePill` only touches refs, so pathname/lang are the real triggers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname, lang]);

  // Labels can change width without a navigation (font load, viewport resize,
  // zoom). Re-measure instead of leaving the pill behind.
  useEffect(() => {
    const L = linksRef.current;
    if (!L) return;
    const sync = () => movePill(activeRef.current ?? L.querySelector<HTMLAnchorElement>('a.on'));
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sync) : null;
    ro?.observe(L);
    addEventListener('resize', sync);
    document.fonts?.ready.then(sync).catch(() => {});
    return () => {
      ro?.disconnect();
      removeEventListener('resize', sync);
    };
  }, [movePill]);

  // When the pointer leaves the nav, snap back to the ACTIVE link (not to
  // whatever was hovered last).
  const resetPill = () => movePill(linksRef.current?.querySelector<HTMLAnchorElement>('a.on') ?? null);

  return (
    <>
      <header
        className={'nav' + (scrolled ? ' sc' : '')}
        style={{ transform: hidden ? 'translateY(-110%)' : undefined }}
      >
        <Link className="brand" to="/" aria-label={S.name + ' — home'}>
          <Brand size={26} />
        </Link>
        <nav
          className="links"
          aria-label="Primary navigation"
          ref={linksRef}
          onPointerLeave={resetPill}
        >
          <i className="pill" ref={pillRef} />
          {MENU.filter((m) => !m.icon).map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              end={m.to === '/'}
              className={({ isActive }) => (isActive ? 'on' : '')}
              onPointerEnter={(e) => movePill(e.currentTarget)}
              onFocus={(e) => movePill(e.currentTarget)}
            >
              {m.label[lang] || m.label.en}
            </NavLink>
          ))}
        </nav>
        <div className="nav-r">
          {MENU.filter((m) => m.icon).map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              className={({ isActive }) => 'nav-ico' + (isActive ? ' on' : '')}
              aria-label={m.label[lang] || m.label.en}
              title={m.label[lang] || m.label.en}
            >
              <Icon name={m.icon as IconName} size={18} />
            </NavLink>
          ))}
          <LanguageSwitch />
          <ThemeSwitch />
          <Link className="nav-cta" to="/contact">
            {lang === 'zh' ? '联系合作' : lang === 'id' ? 'Hubungi saya' : "Let's talk"}
          </Link>
          <button
            className={'burger' + (open ? ' open' : '')}
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mmenu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <i />
            <i />
          </button>
        </div>
      </header>
      <div className={'mmenu' + (open ? ' open' : '')} id="mmenu" aria-label="Mobile menu" aria-hidden={!open}>
        {MENU.map((m, i) => (
          <NavLink
            key={m.to}
            to={m.to}
            end={m.to === '/'}
            style={{ ['--i' as string]: i }}
            tabIndex={open ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            {m.icon && (
              <span className="mm-ico">
                <Icon name={m.icon} size={26} />
              </span>
            )}
            <span className="mm-t">{m.label[lang] || m.label.en}</span>
            {/* A short "all profiles" hint: on mobile the icon-only Linktree
                button is hidden, so the drawer entry has to explain itself. */}
            {m.icon && <small className="mm-hint">{lang === 'zh' ? '所有主页' : lang === 'id' ? 'semua profil' : 'all profiles'}</small>}
          </NavLink>
        ))}
        {/* The drawer covers the navbar, so it carries its own controls. */}
        <div className="mmenu-foot" style={{ ['--i' as string]: MENU.length }}>
          <LanguageSwitch />
          <ThemeSwitch compact />
          <Link className="nav-cta" to="/contact" tabIndex={open ? 0 : -1} onClick={() => setMenuOpen(false)}>
            {lang === 'zh' ? '联系合作' : lang === 'id' ? 'Hubungi saya' : "Let's talk"}
          </Link>
        </div>
      </div>
    </>
  );
}
