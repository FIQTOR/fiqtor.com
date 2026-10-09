import { Link as Link } from "react-router-dom";
import { useContext, useMemo, useState } from "react";
import { TbStack2, TbCornerDownRight, TbTerminal } from "react-icons/tb";
import { ContainerContext } from "@/context/container-context";
import { AnimatePresence, motion } from "framer-motion";
import { BestProjects, RecentProjects } from "@/data/projects";
import type { ProjectHighlight } from "@/data/projects";
import ProjectsComponents from "../components/ProjectItem";
import HighlightTabs from "@/components/projects/HighlightTabs";
import { useTranslation } from "@/i18n";

export default function RecentProjectsSection() {
  const { isTiny } = useContext(ContainerContext);
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ProjectHighlight>("best");

  const counts = useMemo(
    () => ({ best: BestProjects.length, recent: RecentProjects.length }),
    []
  );

  const visibleProjects = activeTab === "best" ? BestProjects : RecentProjects;

  return (
    <section
      id="projects"
      className="w-full font-light text-neutral-700 dark:text-neutral-300 mb-32"
    >
      <div className="px-7 md:px-24 flex flex-col items-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="h-px w-12 bg-linear-to-r from-transparent to-neutral-500" />
          <TbStack2 strokeWidth="1.5" className="h-10 w-10 text-neutral-800 dark:text-neutral-200" />
          <div className="h-px w-12 bg-linear-to-l from-transparent to-neutral-500" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-center mb-6"
        >
          <span className="bg-linear-to-r from-neutral-800 via-neutral-600 to-neutral-800 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100 bg-clip-text text-transparent">
            {activeTab === "best"
              ? t("home.projects.bestTitle")
              : t("home.projects.recentTitle")}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 text-center max-w-2xl leading-relaxed mb-10"
        >
          {activeTab === "best"
            ? t("home.projects.bestSubtitle")
            : t("home.projects.recentSubtitle")}
        </motion.p>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[
            { label: t("home.recent.totalBuilt"), value: counts.best + counts.recent, icon: TbTerminal },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="px-5 py-2 rounded-2xl border border-neutral-300/20 bg-white/30 dark:bg-neutral-900/30 backdrop-blur-md flex items-center gap-3"
            >
              <stat.icon className="h-4 w-4 text-blue-500" />
              <span className="text-xl font-bold text-neutral-800 dark:text-neutral-200">{stat.value}</span>
              <span className="text-xs font-bold uppercase tracking-widest opacity-60">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        <HighlightTabs
          value={activeTab}
          onChange={setActiveTab}
          counts={counts}
          animateMode="inView"
        />
      </div>

      <motion.div
        initial={isTiny ? {} : { opacity: 0, y: 50 }}
        whileInView={isTiny ? {} : { opacity: 1, y: 0 }}
        viewport={isTiny ? {} : { once: true, amount: 0.1 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectsComponents projects={visibleProjects} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="flex w-full items-center justify-center mt-16 text-neutral-700 dark:text-neutral-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/projects"
            className="group relative flex items-center gap-3 self-end rounded-full border border-neutral-400/30 bg-linear-to-r from-neutral-200/50 to-neutral-300/50 px-8 py-3 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-neutral-500/50 hover:shadow-2xl hover:shadow-neutral-400/20 dark:border-neutral-600/30 dark:from-neutral-700/20 dark:to-neutral-600/20 dark:hover:border-neutral-500/50 dark:hover:shadow-neutral-400/20"
          >
            <div className="absolute inset-0 bg-linear-to-r from-neutral-400/20 to-neutral-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            <TbCornerDownRight className="relative h-6 w-6 text-neutral-700 dark:text-neutral-300 transition-transform group-hover:translate-x-1" />
            <span className="relative font-bold text-neutral-800 dark:text-neutral-200">
              {t("home.recent.viewAll", { count: counts.best + counts.recent })}
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
