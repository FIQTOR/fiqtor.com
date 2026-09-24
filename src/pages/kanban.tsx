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
      className="relative min-h-screen overflow-hidden px-5 py-24 font-light text-neutral-700 dark:text-neutral-300 md:px-12"
    >
      <BackgroundBlobs />

      {/* Header */}
      <div className="relative z-10 mb-10 flex flex-col items-center pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center justify-center gap-4"
        >
          <div className="h-px w-12 bg-linear-to-r from-transparent to-neutral-500" />
          <TbLayoutKanban
            strokeWidth="1.5"
            className="h-10 w-10 text-neutral-800 dark:text-neutral-200"
          />
          <div className="h-px w-12 bg-linear-to-l from-transparent to-neutral-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-4 text-center text-4xl font-bold tracking-tight md:text-6xl"
        >
          <span className="bg-linear-to-r from-neutral-800 via-neutral-600 to-neutral-800 bg-clip-text text-transparent dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100">
            Kanban Board
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-2xl text-center text-lg leading-relaxed text-neutral-600 dark:text-neutral-400"
        >
          Manage tasks across a five-stage workflow. Drag cards between columns,
          track progressive outreach counters, and export or import your board.
        </motion.p>
      </div>

      {/* Board */}
      <div className="relative z-10">
        <KanbanBoard />
      </div>
    </section>
  </>
);

export default KanbanPage;
