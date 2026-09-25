import { Link as Link } from "react-router-dom";
import { useContext, useMemo } from "react";
import { TbStack2, TbCornerDownRight, TbTerminal } from "react-icons/tb";
import { ContainerContext } from "@/context/container-context";
import { motion } from "framer-motion";
import { Projects } from "@/data/projects";
import ProjectsComponents from "../components/ProjectItem";

export default function RecentProjects() {
  const { isTiny } = useContext(ContainerContext);

  const stats = useMemo(() => ({
    total: Projects.length,
  }), []);

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
            Recent Projects
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 text-center max-w-2xl leading-relaxed mb-10"
        >
          A curated selection of my latest work, focusing on user-centric design and technical innovation.
        </motion.p>

        <div className="flex flex-wrap justify-center gap-4">
          {[
            { label: "Total Built", value: stats.total, icon: TbTerminal },
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
      </div>

      <motion.div
        initial={isTiny ? {} : { opacity: 0, y: 50 }}
        whileInView={isTiny ? {} : { opacity: 1, y: 0 }}
        viewport={isTiny ? {} : { once: true, amount: 0.1 }}
      >
        <ProjectsComponents />
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
              View all ({Projects.length}) projects
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
