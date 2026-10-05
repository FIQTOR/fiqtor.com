import type { ProjectCategory } from "@/data/projects";
import type { TranslationKey } from "@/i18n/translations";

/** Maps a project category to its translation key. */
export const PROJECT_CATEGORY_KEY: Record<ProjectCategory, TranslationKey> = {
  "AI & Automation": "project.category.ai",
  "Web App": "project.category.webapp",
  "Business System": "project.category.business",
  "E-Commerce": "project.category.ecommerce",
  "Landing Page": "project.category.landing",
  "Template": "project.category.template",
  "Creative": "project.category.creative",
};
