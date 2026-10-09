import { useTheme } from "next-themes";
import { Link as Link } from "react-router-dom";
import { useContext, useEffect, useMemo, memo, useCallback, useState, useRef, useSyncExternalStore } from "react";
import { TbMoon, TbSun, TbMessage, TbWorld, TbCheck } from "react-icons/tb";
import { Menu } from "../data/menu";
import type { Project as MenuItem } from "../data/menu";
import { ContainerContext } from "@/context/container-context";
import { useTranslation } from "@/i18n";
import type { Language } from "@/i18n";
import Tooltip from "./Tooltip";

const THEME_CYCLE = ["light", "dark"] as const;
type ThemeMode = (typeof THEME_CYCLE)[number];

const NavLink = memo(function NavLink({
  menu,
  fullPathName,
  registerRef,
}: {
  menu: MenuItem;
  fullPathName: string;
  registerRef: (el: HTMLAnchorElement | null) => void;
}) {
  const { t } = useTranslation();
  const isActive = fullPathName === menu.pathName;
  const label = t(menu.labelKey);

  return (
    <Tooltip label={label}>
      <Link
        ref={registerRef}
        to={menu.pathName}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
        className={`group focus-ring focus-ring-rounded relative z-10 flex shrink-0 items-center justify-center p-2 sm:p-2.5 md:p-3 transition-colors duration-300 rounded-full ${isActive
          ? "text-blue-500"
          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          }`}
      >
        <menu.Svg className="h-5 w-5 sm:h-[22px] sm:w-[22px] md:h-6 md:w-6" strokeWidth="1.5" />

        {/* Active Dot */}
        {isActive && (
          <span className="absolute -top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
        )}
      </Link>
    </Tooltip>
  );
});

const LANGUAGES: Array<{ code: Language; labelKey: "nav.language.english" | "nav.language.indonesian"; short: string }> = [
  { code: "en", labelKey: "nav.language.english", short: "EN" },
  { code: "id", labelKey: "nav.language.indonesian", short: "ID" },
];

/**
 * Language picker. Renders as a compact pill button that opens a dropdown.
 * Works on both mobile and desktop (the dropdown is anchored above the button). */
function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Index of the highlighted option when the list is open.
  const activeIndex = Math.max(0, LANGUAGES.findIndex((l) => l.code === language));

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Focus the current option when the list opens.
  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  const select = (code: Language) => {
    setLanguage(code);
    setOpen(false);
    buttonRef.current?.focus();
  };

  // Roving focus for the listbox (Arrow/Home/End).
  const onListKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      optionRefs.current[(index + 1) % LANGUAGES.length]?.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      optionRefs.current[(index - 1 + LANGUAGES.length) % LANGUAGES.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      optionRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      optionRefs.current[LANGUAGES.length - 1]?.focus();
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("nav.language.label")}
        className="flex cursor-pointer focus-ring focus-ring-rounded h-9 md:h-10 shrink-0 items-center gap-1 md:gap-1.5 rounded-full px-2 md:px-2.5 text-neutral-600 transition-colors hover:bg-neutral-200/50 dark:text-neutral-400 dark:hover:bg-neutral-800/50"
      >
        <TbWorld className="h-[18px] w-[18px] md:h-5 md:w-5" strokeWidth="1.5" />
        <span className="text-xs font-bold tracking-wide">{language === "id" ? "ID" : "EN"}</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("nav.language.label")}
          className="absolute bottom-full right-0 z-50 mb-3 w-44 overflow-hidden rounded-2xl border border-neutral-200/70 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl dark:border-neutral-700/70 dark:bg-neutral-900/95"
        >
          {LANGUAGES.map((lang, index) => {
            const active = language === lang.code;
            return (
              <button
                key={lang.code}
                ref={(el) => { optionRefs.current[index] = el; }}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={active}
                onClick={() => select(lang.code)}
                onKeyDown={(e) => onListKeyDown(e, index)}
                className={`flex w-full cursor-pointer focus-ring items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider text-neutral-400">{lang.short}</span>
                  {t(lang.labelKey)}
                </span>
                {active && <TbCheck className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { fullPathName } = useContext(ContainerContext);
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  // Client-only flag without a state-setting effect (hydration-safe).
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, top: 0, size: 0, ready: false });

  // Whether the active route is one of the navbar menu items
  const isActiveInMenu = useMemo(
    () => Menu.some((menu) => menu.pathName === fullPathName),
    [fullPathName]
  );

  const registerRef = useCallback(
    (pathName: string) => (el: HTMLAnchorElement | null) => {
      if (el) itemRefs.current.set(pathName, el);
      else itemRefs.current.delete(pathName);
    },
    []
  );

  // Position the circular indicator under the active menu item
  const updateIndicator = useCallback(() => {
    const container = containerRef.current;
    const activeEl = itemRefs.current.get(fullPathName);
    if (!container || !activeEl) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();

    setIndicator({
      left: elRect.left - containerRect.left + elRect.width / 2,
      top: elRect.top - containerRect.top + elRect.height / 2,
      size: Math.max(elRect.width, elRect.height),
      ready: true,
    });
  }, [fullPathName]);

  useEffect(() => {
    updateIndicator();
    // Recalculate on resize to keep the indicator precise
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator, mounted]);

  const currentMode: ThemeMode = theme === "light" ? "light" : "dark";
  const ThemeIcon = currentMode === "light" ? TbSun : TbMoon;
  const themeLabel = t(currentMode === "light" ? "nav.theme.light" : "nav.theme.dark");

  const cycleTheme = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      const button = e?.currentTarget;
      const rect = button?.getBoundingClientRect();
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

      document.documentElement.style.setProperty("--reveal-x", `${x}px`);
      document.documentElement.style.setProperty("--reveal-y", `${y}px`);

      const nextTheme =
        THEME_CYCLE[(THEME_CYCLE.indexOf(currentMode) + 1) % THEME_CYCLE.length];

      if (
        !document.startViewTransition ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setTheme(nextTheme);
        return;
      }

      document.startViewTransition(() => {
        setTheme(nextTheme);
      });
    },
    [currentMode, setTheme]
  );

  const menuItems = useMemo(
    () =>
      Menu.map((menu, index) => (
        <NavLink
          key={index}
          menu={menu}
          fullPathName={fullPathName}
          registerRef={registerRef(menu.pathName)}
        />
      )),
    [fullPathName, registerRef]
  );

  return (
    <>
      {/* Mobile-only Top Right Let's Talk */}
      <div className="fixed right-5 top-5 z-40 md:hidden">
        <Link
          to="/talk"
          className="cta focus-ring focus-ring-rounded relative flex items-center gap-2 overflow-hidden rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-black/10 transition-all duration-300 active:scale-90 dark:bg-white dark:text-neutral-900 dark:shadow-white/10"
        >
          <span aria-hidden className="cta-shine pointer-events-none absolute inset-0 rounded-full" />
          <TbMessage className="cta-icon h-4 w-4" />
          <span>{t("nav.letsTalk")}</span>
        </Link>
      </div>

      {/* Bottom Navbar */}
      <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 px-3 w-full max-w-[calc(100vw-0.5rem)] sm:w-fit sm:px-4 sm:max-w-[95vw] flex justify-center">
        {/*
          The bottom bar is `fixed`, so any `backdrop-filter` here forces the
          GPU to re-blur the page behind it on every scroll frame — one of the
          biggest sources of scroll jank on phones. Mobile gets an (almost)
          opaque background instead of a blurred one; desktop keeps the glass
          look via `md:backdrop-blur-xl`.
        */}
        <nav className="flex items-center gap-0.5 sm:gap-1 md:gap-2 rounded-full border border-neutral-200/50 bg-white/95 p-1 sm:p-1.5 md:p-2 shadow-2xl md:bg-white/70 md:backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/95 md:dark:bg-neutral-900/70">
          <div ref={containerRef} className="relative flex items-center gap-0 sm:gap-0.5 md:gap-1">
            {/* Circle indicator that slides to follow the active menu item */}
            <span
              aria-hidden
              className={`pointer-events-none absolute z-0 bg-neutral-200/70 dark:bg-neutral-800/70 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                indicator.ready && isActiveInMenu
                  ? "opacity-100 rounded-full"
                  : "opacity-0"
              }`}
              style={{
                width: indicator.size,
                height: indicator.size,
                left: indicator.left,
                top: indicator.top,
                transform: "translate(-50%, -50%)",
              }}
            />
            {menuItems}
          </div>

          {/* Desktop-only Let's Talk Button inside center navbar */}
          <Link
            to="/talk"
            className={`cta focus-ring focus-ring-rounded group relative hidden items-center gap-2 overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 md:flex active:scale-95 ${
              fullPathName === "/talk"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-neutral-900 text-white shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:shadow-xl dark:bg-white dark:text-neutral-900 dark:shadow-white/10 dark:hover:bg-neutral-100"
            }`}
          >
            {fullPathName !== "/talk" && (
              <span aria-hidden className="cta-shine pointer-events-none absolute inset-0 rounded-full" />
            )}
            <TbMessage className="cta-icon h-5 w-5" />
            <span className="whitespace-nowrap">{t("nav.letsTalk")}</span>
          </Link>

          {/* Language Switcher + Theme Toggle */}
          <div className="flex items-center gap-0 sm:gap-0.5 border-l border-neutral-300 pl-0.5 sm:pl-1 md:gap-1 md:pl-2 dark:border-neutral-700">
            <LanguageSwitcher />

            <Tooltip label={mounted ? themeLabel : t("nav.theme.label")}>
              <button
                onClick={(e) => cycleTheme(e)}
                aria-label={themeLabel}
                className="flex cursor-pointer focus-ring focus-ring-rounded h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-200/50 dark:text-neutral-400 dark:hover:bg-neutral-800/50"
              >
                {!mounted ? (
                  <div className="h-5 w-5 md:h-6 md:w-6 animate-pulse rounded-full bg-neutral-300 dark:bg-neutral-700" />
                ) : (
                  <ThemeIcon className="h-5 w-5 md:h-6 md:w-6" />
                )}
              </button>
            </Tooltip>
          </div>
        </nav>
      </div>
    </>
  );
}
