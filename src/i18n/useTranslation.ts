import { useContext } from "react";
import { LanguageContext } from "./language-context";

/**
 * Access the active language and the `t()` translation helper.
 *
 *   const { t, language, toggleLanguage } = useTranslation();
 *   <h1>{t("home.about.title")}</h1>
 */
export function useTranslation() {
  return useContext(LanguageContext);
}
