import { createContext, useContext } from "react";

export interface WelcomeContextProps {
  showWelcome: boolean;
  isWelcomeDone: boolean;
  /** Skip the intro immediately (used by the "Skip" button / reduced motion). */
  skipWelcome: () => void;
}

/**
 * Welcome-screen context. Defined in its own module (separate from the provider
 * component) so React Fast Refresh keeps working — a module that exports a
 * component must not also export hooks/constants.
 */
export const WelcomeContext = createContext<WelcomeContextProps>({
  showWelcome: true,
  isWelcomeDone: false,
  skipWelcome: () => {},
});

export const useWelcome = () => useContext(WelcomeContext);
