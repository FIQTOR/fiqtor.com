import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import HelmetContainer from "@/components/HelmetContainer";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";
import InitialMotion from "@/components/InitialMotion";
import ProjectsGrid from "@/modules/projects/components/ProjectsGrid";
import { TbStack2, TbTerminal, TbSearch, TbFilter } from "react-icons/tb";
import { motion } from "framer-motion";
import { Projects, ProjectCategories } from "@/data/projects";
import type { ProjectCategory } from "@/data/projects";
import { BRAND_NAME } from "@/config/Identity";

type ActiveCategory = ProjectCategory | "all" | "live";

const isProjectCategory = (value: string): value is ProjectCategory =>
  (ProjectCategories as Array<string>).includes(value);

const isLivePreview = (project: { urlDirect?: string }): boolean =>
  typeof project.urlDirect === "string" && project.urlDirect.trim().length > 0;

const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("q") ?? "";
  const categoryParam = searchParams.get("category") ?? "";
  const activeCategory: ActiveCategory =
    categoryParam === "live"
      ? "live"
      : isProjectCategory(categoryParam)
        ? categoryParam
        : "all";

  const updateParams = (next: { q?: string; category?: ActiveCategory }) => {
    const params = new URLSearchParams(searchParams);

    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }

    if (next.category !== undefined) {
      if (next.category !== "all") params.set("category", next.category);
      else params.delete("category");
    }

    setSearchParams(params, { replace: true });
  };

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return Projects.filter((project) => {
      const matchesCategory =
        activeCategory === "all"
          ? true
          : activeCategory === "live"
            ? isLivePreview(project)
            : project.category === activeCategory;

      if (!query) return matchesCategory;

      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
        project.icons.some((icon) => icon.title.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const stats = useMemo(() => ({
    total: Projects.length,
  }), []);

  const liveCount = useMemo(
    () => Projects.filter(isLivePreview).length,
    []
  );

  const categoryTabs = useMemo<Array<{ id: ActiveCategory; label: string; count: number }>>(() => {
    return [
      { id: "all", label: "All", count: Projects.length },
      { id: "live", label: "Live Preview", count: liveCount },
      ...ProjectCategories.map((category) => ({
        id: category,
        label: category,
        count: Projects.filter((p) => p.category === category).length,
      })),
    ];
  }, [liveCount]);

  return (
    <>
      <HelmetContainer page="projects" />
      <section
        id="projects"
        className="relative min-h-screen px-7 py-24 font-light text-neutral-700 dark:text-neutral-300 md:px-36 overflow-hidden"
      >
        <BackgroundBlobs />

        {/* Header Section */}
        <div className="relative z-10 flex flex-col items-center mb-16 pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="h-px w-12 bg-linear-to-r from-transparent to-neutral-500" />
            <TbStack2 strokeWidth="1.5" className="h-10 w-10 text-neutral-800 dark:text-neutral-200" />
            <div className="h-px w-12 bg-linear-to-l from-transparent to-neutral-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-center mb-6"
          >
            <span className="bg-linear-to-r from-neutral-800 via-neutral-600 to-neutral-800 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100 bg-clip-text text-transparent">
              {`Projects by ${BRAND_NAME}`}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 text-center max-w-2xl leading-relaxed mb-10"
          >
            {Projects.length} shipped applications across AI automation, web apps,
            business systems, e-commerce, landing pages, and templates.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "Total Built", value: stats.total, icon: TbTerminal },
              { label: "Showing", value: filteredProjects.length, icon: TbFilter },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="px-5 py-2 rounded-2xl border border-neutral-300/20 bg-white/30 dark:bg-neutral-900/30 backdrop-blur-md flex items-center gap-3"
              >
                <stat.icon className="h-4 w-4 text-blue-500" />
                <span className="text-xl font-bold text-neutral-800 dark:text-neutral-200">{stat.value}</span>
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Filters & Search UI */}
        <div className="relative z-10 mb-12 flex flex-col gap-6">
          <div className="relative group max-w-md w-full">
            <TbSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              aria-label="Search projects"
              placeholder="Search by title, tech, category, or tag..."
              value={searchQuery}
              onChange={(e) => updateParams({ q: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-300/30 dark:border-neutral-800/50 focus:border-blue-500/50 outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap p-1 gap-1 rounded-2xl bg-neutral-200/50 dark:bg-neutral-800/50 backdrop-blur-md border border-neutral-300/30 dark:border-neutral-700/30 w-fit">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={activeCategory === tab.id}
                onClick={() => updateParams({ category: tab.id })}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${activeCategory === tab.id
                  ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-lg"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  }`}
              >
                {tab.label}
                <span className="text-[10px] font-bold opacity-60">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="relative z-10">
          <InitialMotion>
            <ProjectsGrid projects={filteredProjects} />
          </InitialMotion>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-neutral-500"
            >
              <TbStack2 className="h-20 w-20 opacity-20 mb-4" />
              <p className="text-xl font-medium">No projects found matching your search.</p>
              <button
                onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}
                className="mt-4 text-blue-500 hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProjectsPage;
