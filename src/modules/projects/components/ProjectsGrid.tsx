import type { Project } from "@/data/projects";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TbWorldShare, TbX } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

type SelectedProject = Project;

interface ProjectsGridProps {
  projects: Array<Project>;
}

const CARD_TRANSITION = {
  type: "spring",
  stiffness: 320,
  damping: 34,
  mass: 0.9,
} as const;

const PANEL_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 32,
  mass: 0.9,
} as const;

export default function ProjectsCard({ projects }: ProjectsGridProps) {
  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(null);

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  return (
    <div className="relative">
      <motion.div
        layout
        className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => {
            return (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={CARD_TRANSITION}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedProject(project)}
                className="group relative h-full min-h-[280px] w-full cursor-pointer overflow-hidden rounded-2xl border border-neutral-300/20 bg-neutral-100 shadow-xl backdrop-blur-md transition-shadow duration-300 hover:shadow-2xl dark:border-neutral-700/30 dark:bg-neutral-900 sm:min-h-[300px]"
              >
                {/* Project Image */}
                <img
                  src={project.srcImage}
                  alt="projectImage.webp"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-neutral-950/95 via-neutral-950/40 to-neutral-950/10" />
                <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-neutral-950/50 to-transparent" />

                {/* Project Content */}
                <div className="relative flex h-full w-full flex-col justify-between gap-4 p-5 sm:p-6">
                  <div className="flex items-start justify-end gap-3">
                    <span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-100 backdrop-blur-md">
                      {project.category}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Project Title */}
                    <h3 className="text-lg font-bold text-white leading-snug line-clamp-2 sm:text-xl">
                      {project.title}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags &&
                        project.tags.slice(0, 4).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-neutral-100 backdrop-blur-md"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>

                    {/* Project Description */}
                    <p className="text-sm text-neutral-300 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      {project.icons.map((icon, iconIndex) => (
                        <span
                          key={iconIndex}
                          className="grid place-items-center rounded-lg border border-white/10 bg-white/10 p-1.5 text-white backdrop-blur-md"
                          title={icon.title}
                        >
                          <icon.SvgIcon className="h-5 w-5" />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Modal Overlay */}
      {createPortal(
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              key="project-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            />
          )}

          {selectedProject && (
            <motion.div
              key="project-modal-panel"
              initial={{ opacity: 0, scale: 0.94, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16, transition: { duration: 0.18, ease: "easeIn" } }}
              transition={PANEL_TRANSITION}
              className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center p-4"
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label={selectedProject.title}
                className="scrollbar-hide pointer-events-auto relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-neutral-900"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close project detail"
                  className="absolute cursor-pointer top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                >
                  <TbX className="h-6 w-6" />
                </button>

                {/* Hero Image di Modal */}
                <div className="relative w-full h-64 sm:h-80 overflow-hidden">
                  <img
                    src={selectedProject.srcImage}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent to-white dark:to-neutral-900"></div>

                  <span className="absolute top-4 left-8 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    {selectedProject.category}
                  </span>

                  <h2 className="absolute bottom-14 left-8 text-2xl sm:text-3xl text-neutral-900 font-medium dark:text-white">
                    {selectedProject.title}
                  </h2>

                  {/* Tags */}
                  <div className="absolute left-8 bottom-0 flex flex-wrap gap-2 mb-6">
                    {selectedProject.tags?.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
                    {selectedProject.description}
                  </p>

                  {/* Tech Stack Icons */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">Tech Stack</h4>
                    <div className="flex flex-wrap gap-4">
                      {selectedProject.icons?.map((icon, i) => (
                        <div key={i} className="group relative flex flex-col items-center">
                          <icon.SvgIcon className="h-8 w-8 text-neutral-700 dark:text-neutral-300 hover:text-blue-500 transition-colors" />
                          <span className="absolute -top-8 scale-0 group-hover:scale-100 transition-transform bg-neutral-800 text-white text-[10px] px-2 py-1 rounded">
                            {icon.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    {selectedProject.urlDirect ? (
                      <a
                        href={selectedProject.urlDirect}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/20"
                      >
                        <TbWorldShare className="h-5 w-5" />
                        Preview Project
                      </a>
                    ) : (
                      <Link
                        to="/talk"
                        onClick={() => setSelectedProject(null)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-800 dark:bg-white dark:text-black px-6 py-3 text-white font-semibold transition-all hover:opacity-90 active:scale-95"
                      >
                        Contact Dev
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
