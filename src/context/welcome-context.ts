import { createContext, useContext } from "react";

export interface WelcomeContextProps {
  showWelcome: boolean;
  isWelcomeDone: boolean;
}

/**
 * Welcome-screen context. Defined in its own module (separate from the provider
 * component) so React Fast Refresh keeps working — a module that exports a
 * component must not also export hooks/constants.
 */
export const WelcomeContext = createContext<WelcomeContextProps>({
  showWelcome: true,
  isWelcomeDone: false,
});

export const useWelcome = () => useContext(WelcomeContext);
