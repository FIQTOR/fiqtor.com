import { useTheme } from "next-themes";
import { Link as Link } from "react-router-dom";
import { useContext, useEffect, useMemo, memo, useCallback, useState, useRef } from "react";
import { TbMoon, TbSun, TbMessage } from "react-icons/tb";
import { Menu } from "../data/menu";
import { ContainerContext } from "@/context/ContainerProvider";

const THEME_CYCLE = ["light", "dark"] as const;
type ThemeMode = (typeof THEME_CYCLE)[number];

const THEME_META: Record<ThemeMode, { label: string; Icon: typeof TbSun }> = {
  light: { label: "Light Mode", Icon: TbSun },
  dark: { label: "Dark Mode", Icon: TbMoon },
};

const NavLink = memo(function NavLink({
  menu,
  handle,
  fullPathName,
  registerRef,
}: {
  menu: any;
  handle: any;
  fullPathName: string;
  registerRef: (el: HTMLAnchorElement | null) => void;
}) {
  const isActive = fullPathName === menu.pathName;

  return (
    <Link
      ref={registerRef}
      to={menu.pathName}
      onClick={() => handle(menu.pathName)}
      className={`group relative z-10 flex items-center justify-center p-3 transition-colors duration-300 rounded-full ${isActive
        ? "text-blue-500"
        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        }`}
    >
      <menu.Svg className="h-6 w-6" strokeWidth="1.5" />

      {/* Active Dot */}
      {isActive && (
        <span className="absolute -top-1 right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
      )}

      {/* Tooltip - Animated scale & opacity */}
      <div className="absolute bottom-full mb-3 flex flex-col items-center opacity-0 scale-75 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 ease-out origin-bottom">
        <span className="relative z-10 whitespace-nowrap rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-xl dark:bg-neutral-100 dark:text-neutral-900">
          {menu.label}
        </span>
        {/* Tooltip Arrow */}
        <div className="-mt-1 h-2 w-2 rotate-45 bg-neutral-900 dark:bg-neutral-100"></div>
      </div>
    </Link>
  );
});

export default function Navbar() {
  const { fullPathName, setFullPathName } = useContext(ContainerContext);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, top: 0, size: 0, ready: false });

  // Apakah menu aktif ada di dalam daftar menu navbar
  const isActiveInMenu = useMemo(
    () => Menu.some((menu) => menu.pathName === fullPathName),
    [fullPathName]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const registerRef = useCallback(
    (pathName: string) => (el: HTMLAnchorElement | null) => {
      if (el) itemRefs.current.set(pathName, el);
      else itemRefs.current.delete(pathName);
    },
    []
  );

  // Hitung posisi indikator lingkaran mengikuti menu aktif
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
    // re-calculate saat resize agar tetap presisi
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator, mounted]);

  const currentMode: ThemeMode = theme === "light" ? "light" : "dark";
  const ThemeIcon = THEME_META[currentMode].Icon;

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

  const handleNavClick = useCallback(
    (section: string) => {
      setFullPathName(section);
    },
    [setFullPathName]
  );

  const menuItems = useMemo(
    () =>
      Menu.map((menu, index) => (
        <NavLink
          key={index}
          menu={menu}
          handle={handleNavClick}
          fullPathName={fullPathName}
          registerRef={registerRef(menu.pathName)}
        />
      )),
    [handleNavClick, fullPathName, registerRef]
  );

  return (
    <>
      {/* Mobile-only Top Right Let's Talk */}
      <div className="fixed right-5 top-5 z-40 md:hidden">
        <Link
          to="/talk"
          onClick={() => handleNavClick("/talk")}
          className="cta relative flex items-center gap-2 overflow-hidden rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-black/10 transition-all duration-300 active:scale-90 dark:bg-white dark:text-neutral-900 dark:shadow-white/10"
        >
          <span aria-hidden className="cta-shine pointer-events-none absolute inset-0 rounded-full" />
          <TbMessage className="cta-icon h-4 w-4" />
          <span>Let's Talk</span>
        </Link>
      </div>

      {/* Bottom Navbar */}
      <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 px-4 w-fit max-w-[95vw]">
        <nav className="flex items-center gap-1 md:gap-2 rounded-full border border-neutral-200/50 bg-white/70 p-1.5 md:p-2 shadow-2xl backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/70">
          <div ref={containerRef} className="relative flex items-center gap-0.5 md:gap-1">
            {/* Circle indicator yang berpindah-pindah mengikuti menu aktif */}
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
            onClick={() => handleNavClick("/talk")}
            className={`cta group relative hidden items-center gap-2 overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 md:flex active:scale-95 ${
              fullPathName === "/talk"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-neutral-900 text-white shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:shadow-xl dark:bg-white dark:text-neutral-900 dark:shadow-white/10 dark:hover:bg-neutral-100"
            }`}
          >
            {fullPathName !== "/talk" && (
              <span aria-hidden className="cta-shine pointer-events-none absolute inset-0 rounded-full" />
            )}
            <TbMessage className="cta-icon h-5 w-5" />
            <span className="whitespace-nowrap">Let's Talk</span>
          </Link>

          {/* Theme Toggle Button */}
          <div className="group relative border-l border-neutral-300 dark:border-neutral-700 pl-1 md:pl-2">
            <button
              onClick={(e) => cycleTheme(e)}
              aria-label={THEME_META[currentMode].label}
              className="flex cursor-pointer h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-200/50 dark:text-neutral-400 dark:hover:bg-neutral-800/50"
            >
              {!mounted ? (
                <div className="h-6 w-6 animate-pulse rounded-full bg-neutral-300 dark:bg-neutral-700" />
              ) : (
                <ThemeIcon className="h-6 w-6" />
              )}
            </button>

            {/* Theme Tooltip */}
            <div className="absolute bottom-full -translate-x-1/2 left-1/2 mb-3 flex flex-col items-center opacity-0 scale-75 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 ease-out origin-bottom">
              <span className="relative z-10 whitespace-nowrap rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-xl dark:bg-neutral-100 dark:text-neutral-900">
                {mounted ? THEME_META[currentMode].label : "Theme"}
              </span>
              <div className="-mt-1 h-2 w-2 rotate-45 bg-neutral-900 dark:bg-neutral-100"></div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}