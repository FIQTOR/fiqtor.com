import { createContext } from "react";
import type { Language, TranslationKey } from "./translations";

export interface LanguageContextProps {
  /** Active language. */
  language: Language;
  /** Switch the active language (persisted to localStorage). */
  setLanguage: (language: Language) => void;
  /** Toggle between the two supported languages. */
  toggleLanguage: () => void;
  /**
   * Translate a key, interpolating `{placeholder}` tokens from `vars`.
   * Falls back to the key itself if a translation is missing.
   */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

/**
 * Kept in its own module (separate from the provider) so React Fast Refresh
 * stays happy — a file exporting a provider component must not also export
 * non-component values.
 */
export const LanguageContext = createContext<LanguageContextProps>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => key,
});
