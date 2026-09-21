import { Projects } from "@/data/projects";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { TbWorldShare, TbX } from "react-icons/tb";
import gsap from "gsap";

export default function ProjectsComponents() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const titles = containerRef.current.querySelectorAll(".project-title-gsap");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chars = entry.target.querySelectorAll(".char");
            gsap.fromTo(
              chars,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.025,
                ease: "power2.out",
              }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    titles.forEach((title) => {
      observer.observe(title);
    });

    return () => observer.disconnect();
  }, []);

  const renderSplitText = (text: string) => {
    return text.split("").map((char, i) => (
      <span key={i} className="char inline-block whitespace-pre opacity-0">
        {char}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex flex-col w-full divide-y divide-neutral-200/20 dark:divide-neutral-800/40">
        {Projects.slice(0, 4).map((project: any, index: number) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={index}
              onClick={() => setSelectedProject({ ...project, index })}
              className={`group cursor-pointer relative w-full flex flex-col md:flex-row ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              } min-h-[320px] md:min-h-[380px] overflow-hidden transition-colors duration-300 hover:bg-neutral-500/5`}
            >
              {/* Image Container (1/3 Width on Desktop) with Smooth Mask Fade */}
              <div className="relative w-full md:w-1/3 h-64 md:h-auto overflow-hidden shrink-0">
                <img
                  src={project.srcImage}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{
                    WebkitMaskImage: isEven
                      ? "linear-gradient(to right, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)"
                      : "linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
                    maskImage: isEven
                      ? "linear-gradient(to right, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)"
                      : "linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
                  }}
                />
                
                {/* Mobile Gradient (Bottom Fade) */}
                <div className="md:hidden absolute inset-0 bg-linear-to-t from-neutral-100 via-neutral-100/60 to-transparent dark:from-neutral-950 dark:via-neutral-950/60" />
              </div>

              {/* Text / Details Container (2/3 Width on Desktop) */}
              <div className="relative w-full md:w-2/3 flex flex-col justify-center p-6 sm:p-10 md:p-12 gap-4 z-10">
                <h3 className="project-title-gsap text-2xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-500 transition-colors">
                  {renderSplitText(project.title)}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag: string, tagIndex: number) => (
                    <span
                      key={tagIndex}
                      className="rounded-full border border-neutral-300/30 dark:border-neutral-700/40 bg-neutral-200/40 dark:bg-neutral-800/40 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 backdrop-blur-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mr-1">
                    Tech Stack:
                  </span>
                  {project.icons?.map((icon: any, iconIndex: number) => (
                    <div key={iconIndex} className="group/tooltip relative flex items-center justify-center">
                      <span className="grid place-items-center rounded-lg border border-neutral-300/30 dark:border-neutral-700/40 bg-neutral-200/50 dark:bg-neutral-800/50 p-2 text-neutral-800 dark:text-neutral-200 backdrop-blur-md transition-transform group-hover/tooltip:scale-110">
                        <icon.SvgIcon className="h-5 w-5" />
                      </span>
                      <span className="absolute -top-9 px-2.5 py-1 text-[11px] font-medium text-white bg-neutral-900 dark:bg-neutral-800 rounded-md shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-30 border border-neutral-700/50">
                        {icon.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-60 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto rounded-3xl bg-white dark:bg-neutral-900 shadow-2xl">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute cursor-pointer top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                >
                  <TbX className="h-6 w-6" />
                </button>

                <div className="relative w-full h-64 sm:h-80 overflow-hidden">
                  <img
                    src={selectedProject.srcImage}
                    alt={selectedProject.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-white dark:from-neutral-900 via-transparent" />
                  <h2 className="absolute bottom-6 left-8 text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                    {selectedProject.title}
                  </h2>
                </div>

                <div className="p-6 sm:p-8">
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
                    {selectedProject.description}
                  </p>

                  <div className="mb-8">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Tech Stack</h4>
                    <div className="flex flex-wrap gap-4">
                      {selectedProject.icons?.map((icon: any, i: number) => (
                        <div key={i} className="group/tooltip relative flex flex-col items-center">
                          <span className="grid place-items-center rounded-xl border border-neutral-300/40 dark:border-neutral-700/50 bg-neutral-100 dark:bg-neutral-800/80 p-3 text-neutral-800 dark:text-neutral-200 transition-transform group-hover/tooltip:scale-110">
                            <icon.SvgIcon className="h-7 w-7" />
                          </span>
                          <span className="absolute -top-9 px-2.5 py-1 text-[11px] font-medium text-white bg-neutral-900 dark:bg-neutral-800 rounded-md shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-30 border border-neutral-700/50">
                            {icon.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                    {selectedProject.urlDirect ? (
                      <a
                        href={selectedProject.urlDirect}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
                      >
                        <TbWorldShare className="h-5 w-5" />
                        Visit Live Project
                      </a>
                    ) : (
                      <Link
                        to="/talk"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-800 dark:bg-white dark:text-black px-6 py-4 text-white font-bold"
                      >
                        Contact Developer
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
