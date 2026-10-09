import { motion } from "framer-motion";
import type { ProjectHighlight } from "@/data/projects";
import type { TranslationKey } from "@/i18n";
import { useTranslation } from "@/i18n";

interface HighlightTabsProps {
  /** Currently active tab. */
  value: ProjectHighlight;
  /** Called when the user picks the other tab. */
  onChange: (value: ProjectHighlight) => void;
  /** Optional counts rendered next to each label. */
  counts?: Record<ProjectHighlight, number>;
  /** `inView` keeps the mount animation consistent with scroll-triggered sections. */
  animateMode?: "mount" | "inView";
  className?: string;
}

const OPTIONS: Array<{ id: ProjectHighlight; labelKey: TranslationKey }> = [
  { id: "best", labelKey: "projects.tab.best" },
  { id: "recent", labelKey: "projects.tab.recent" },
];

/**
 * Pill-style switch between the "Best Project" and "Recent Project" lists.
 * Reused on both the homepage section and the full projects page.
 */
export default function HighlightTabs({
  value,
  onChange,
  counts,
  animateMode = "mount",
  className = "",
}: HighlightTabsProps) {
  const { t } = useTranslation();

  const animationProps =
    animateMode === "inView"
      ? { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } }
      : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <motion.div
      {...animationProps}
      className={`flex flex-wrap p-1 gap-1 rounded-2xl bg-neutral-200/50 dark:bg-neutral-800/50 backdrop-blur-md border border-neutral-300/30 dark:border-neutral-700/30 w-fit ${className}`}
    >
      {OPTIONS.map((option) => {
        const isActive = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              isActive
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-lg"
                : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            {t(option.labelKey)}
            {counts && <span className="text-xs font-bold opacity-70">{counts[option.id]}</span>}
          </button>
        );
      })}
    </motion.div>
  );
}
