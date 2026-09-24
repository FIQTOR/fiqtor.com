/**
 * KanbanBoard — orchestrates the whole board.
 *
 * Wires the store hook (persistence + CRUD), the DnD hook, search/priority
 * filtering, and the add/edit + confirm dialogs. Everything below this is a
 * pure presentational component.
 */
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TbLayoutKanban } from "react-icons/tb";
import KanbanColumn from "@/modules/kanban/components/KanbanColumn";
import KanbanToolbar from "@/modules/kanban/components/KanbanToolbar";
import TaskModal from "@/modules/kanban/components/TaskModal";
import ConfirmDialog from "@/modules/kanban/components/ConfirmDialog";
import { useKanbanStore } from "@/modules/kanban/hooks/useKanbanStore";
import { useKanbanDnD } from "@/modules/kanban/hooks/useKanbanDnD";
import { KANBAN_COLUMNS, KANBAN_PRIORITY_MAP } from "@/data/kanban";
import { downloadFile, exportFilename } from "@/modules/kanban/kanban.utils";
import type { KanbanPriority, KanbanStatus, Task, TaskDraft } from "@/types/kanban";

type ModalState =
  | { open: false }
  | { open: true; mode: "add"; status: KanbanStatus }
  | { open: true; mode: "edit"; task: Task };

export default function KanbanBoard() {
  const store = useKanbanStore();
  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<KanbanPriority | "all">(
    "all"
  );
  const [modal, setModal] = useState<ModalState>({ open: false });
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const dnd = useKanbanDnD({ onMove: store.moveTask });

  const flash = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  // Filter + group tasks into columns, sorting by priority then recency.
  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = store.tasks.filter((task) => {
      const matchesQuery =
        !q ||
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q);
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      return matchesQuery && matchesPriority;
    });

    const byStatus: Record<KanbanStatus, Task[]> = {
      backlog: [],
      todo: [],
      "in-progress": [],
      "on-hold": [],
      done: [],
    };
    for (const task of filtered) byStatus[task.status].push(task);

    for (const status of Object.keys(byStatus) as KanbanStatus[]) {
      byStatus[status].sort((a, b) => {
        const p = KANBAN_PRIORITY_MAP[a.priority].order - KANBAN_PRIORITY_MAP[b.priority].order;
        if (p !== 0) return p;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
    }
    return byStatus;
  }, [store.tasks, query, priorityFilter]);

  const visibleCount = useMemo(
    () => Object.values(grouped).reduce((sum, list) => sum + list.length, 0),
    [grouped]
  );

  const savedLabel = useMemo(
    () =>
      store.savedAt
        ? `Saved ${new Date(store.savedAt).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}`
        : null,
    [store.savedAt]
  );

  const handleSubmit = useCallback(
    (draft: TaskDraft) => {
      if (modal.open && modal.mode === "edit") {
        store.updateTask(modal.task.id, draft);
        flash("Task updated");
      } else {
        store.addTask(draft);
        flash("Task created");
      }
    },
    [modal, store, flash]
  );

  const handleImportFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          if (store.replaceState(parsed)) flash("Board imported");
          else flash("Import failed: invalid file");
        } catch {
          flash("Import failed: could not parse JSON");
        }
      };
      reader.onerror = () => flash("Import failed: could not read file");
      reader.readAsText(file);
    },
    [store, flash]
  );

  const handleExport = useCallback(() => {
    downloadFile(exportFilename(), store.exportJson());
    flash("Board exported");
  }, [store, flash]);

  return (
    <div className="flex flex-col gap-5">
      <KanbanToolbar
        query={query}
        onQueryChange={setQuery}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        taskCount={visibleCount}
        savedLabel={savedLabel}
        onAddTask={() => setModal({ open: true, mode: "add", status: "backlog" })}
        onExport={handleExport}
        onImportFile={handleImportFile}
        onReset={() => setConfirmReset(true)}
      />

      {store.persistError && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
          Could not write to localStorage (storage may be full or disabled).
          Your changes are kept for this session only.
        </p>
      )}

      {/* Board */}
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-4">
        {KANBAN_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={grouped[column.id]}
            dnd={dnd}
            onEdit={(task) => setModal({ open: true, mode: "edit", task })}
            onDelete={setPendingDelete}
            onAdd={(status) => setModal({ open: true, mode: "add", status })}
          />
        ))}
      </div>

      {/* Empty board hint */}
      {visibleCount === 0 && store.tasks.length > 0 && (
        <div className="flex flex-col items-center gap-2 py-10 text-center text-neutral-400">
          <TbLayoutKanban className="h-8 w-8 opacity-40" />
          <p className="text-sm">No tasks match your search or filter.</p>
        </div>
      )}

      {/* Add / Edit modal */}
      <TaskModal
        open={modal.open}
        mode={modal.open ? modal.mode : "add"}
        initialStatus={modal.open && modal.mode === "add" ? modal.status : "backlog"}
        task={modal.open && modal.mode === "edit" ? modal.task : null}
        onClose={() => setModal({ open: false })}
        onSubmit={handleSubmit}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete task?"
        message={`"${pendingDelete?.title ?? ""}" will be permanently removed.`}
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) store.deleteTask(pendingDelete.id);
          setPendingDelete(null);
          flash("Task deleted");
        }}
      />

      {/* Reset confirmation */}
      <ConfirmDialog
        open={confirmReset}
        title="Reset board?"
        message="This restores the sample tasks and discards all your current tasks."
        confirmLabel="Reset"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          store.resetToSeed();
          setConfirmReset(false);
          flash("Board reset to sample data");
        }}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="pointer-events-none fixed bottom-24 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-neutral-200/70 bg-white/90 px-4 py-2 text-xs font-semibold text-neutral-700 shadow-xl backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-900/90 dark:text-neutral-200"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
