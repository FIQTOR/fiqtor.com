import { motion } from "framer-motion";
import { TbLayoutKanban } from "react-icons/tb";
import HelmetContainer from "@/components/HelmetContainer";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";
import KanbanBoard from "@/modules/kanban/components/KanbanBoard";

const KanbanPage = () => (
  <>
    <HelmetContainer page="kanban" />
    <section
      id="kanban"
      className="page-base page-x relative pb-24 pt-24"
    >
      <BackgroundBlobs />

      {/* Header */}
      <div className="relative z-10 mb-8 flex flex-col items-center pt-6 md:mb-10 md:pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-5 flex items-center justify-center gap-4"
        >
          <div className="h-px w-12 bg-linear-to-r from-transparent to-neutral-500" />
          <TbLayoutKanban
            strokeWidth="1.5"
            className="h-9 w-9 text-neutral-800 dark:text-neutral-200 md:h-10 md:w-10"
          />
          <div className="h-px w-12 bg-linear-to-l from-transparent to-neutral-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl"
        >
          <span className="bg-linear-to-r from-neutral-800 via-neutral-600 to-neutral-800 bg-clip-text text-transparent dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100">
            Kanban Board
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-2xl text-center text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg"
        >
          Manage tasks across a five-stage workflow. Drag cards between columns,
          track progressive outreach counters, and export or import your board.
        </motion.p>
      </div>

      {/* Board — full width, fills the viewport on desktop */}
      <div className="relative z-10 w-full">
        <KanbanBoard />
      </div>
    </section>
  </>
);

export default KanbanPage;
