import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { WelcomeContext } from "./welcome-context";

const WELCOME_DURATION = 3200;
/** Shortened intro when the user prefers reduced motion. */
const WELCOME_DURATION_REDUCED = 600;
const SEEN_KEY = "hasSeenWelcome";

interface WelcomeProviderProps {
  children: ReactNode;
}

export default function WelcomeProvider({ children }: WelcomeProviderProps) {
  // Skip the intro entirely for returning visitors (same session).
  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem(SEEN_KEY) !== "true";
  });

  const skipWelcome = useCallback(() => {
    sessionStorage.setItem(SEEN_KEY, "true");
    setShowWelcome(false);
  }, []);

  useEffect(() => {
    if (!showWelcome) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(
      () => {
        sessionStorage.setItem(SEEN_KEY, "true");
        setShowWelcome(false);
      },
      reduced ? WELCOME_DURATION_REDUCED : WELCOME_DURATION
    );

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [showWelcome]);

  const value = useMemo(
    () => ({ showWelcome, isWelcomeDone: !showWelcome, skipWelcome }),
    [showWelcome, skipWelcome]
  );

  return (
    <WelcomeContext.Provider value={value}>{children}</WelcomeContext.Provider>
  );
}
