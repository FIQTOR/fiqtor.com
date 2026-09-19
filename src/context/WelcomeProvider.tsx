import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const WELCOME_DURATION = 3200;

interface WelcomeContextProps {
  showWelcome: boolean;
  isWelcomeDone: boolean;
}

export const WelcomeContext = createContext<WelcomeContextProps>({
  showWelcome: true,
  isWelcomeDone: false,
});

export const useWelcome = () => useContext(WelcomeContext);

interface WelcomeProviderProps {
  children: ReactNode;
}

export default function WelcomeProvider({ children }: WelcomeProviderProps) {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (showWelcome) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
    const timer = setTimeout(() => setShowWelcome(false), WELCOME_DURATION);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [showWelcome]);

  const value = useMemo(
    () => ({ showWelcome, isWelcomeDone: !showWelcome }),
    [showWelcome]
  );

  return (
    <WelcomeContext.Provider value={value}>{children}</WelcomeContext.Provider>
  );
}
