/**
 * KanbanBoard — orchestrates the whole board.
 *
 * Wires the store hook (persistence + CRUD), the DnD hook, search/priority
 * filtering, and the add/edit + confirm dialogs. Everything below this is a
 * pure presentational component.
 */
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { TbLayoutKanban, TbPlus } from "react-icons/tb";
import KanbanColumn from "@/modules/kanban/components/KanbanColumn";
import KanbanToolbar from "@/modules/kanban/components/KanbanToolbar";
import TaskModal from "@/modules/kanban/components/TaskModal";
import ConfirmDialog from "@/modules/kanban/components/ConfirmDialog";
import { useKanbanStore } from "@/modules/kanban/hooks/useKanbanStore";
import { useKanbanDnD } from "@/modules/kanban/hooks/useKanbanDnD";
import { KANBAN_COLUMNS, KANBAN_PRIORITIES, KANBAN_PRIORITY_MAP } from "@/data/kanban";
import { downloadFile, exportFilename } from "@/modules/kanban/kanban.utils";
import type { KanbanPriority, KanbanStatus, Task, TaskDraft } from "@/types/kanban";

type ModalState =
  | { open: false }
  | { open: true; mode: "add"; status: KanbanStatus }
  | { open: true; mode: "edit"; task: Task };

const PRIORITY_VALUES = KANBAN_PRIORITIES.map((p) => p.id) as readonly string[];

export default function KanbanBoard() {
  const store = useKanbanStore();
  // Search + priority filter are mirrored to the URL so the view survives a
  // refresh/back — consistent with the Projects page (?q=).
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const priorityParam = params.get("priority");
  const priorityFilter: KanbanPriority | "all" =
    priorityParam && PRIORITY_VALUES.includes(priorityParam)
      ? (priorityParam as KanbanPriority)
      : "all";

  const setQuery = useCallback(
    (value: string) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set("q", value);
          else next.delete("q");
          return next;
        },
        { replace: true }
      ),
    [setParams]
  );

  const setPriorityFilter = useCallback(
    (value: KanbanPriority | "all") =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === "all") next.delete("priority");
          else next.set("priority", value);
          return next;
        },
        { replace: true }
      ),
    [setParams]
  );

  const [modal, setModal] = useState<ModalState>({ open: false });
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmOverwrite, setConfirmOverwrite] = useState<"samples" | "import" | null>(null);
  const [pendingImport, setPendingImport] = useState<unknown>(null);
  const [toast, setToast] = useState<string | null>(null);

  const dnd = useKanbanDnD({ onMove: store.moveTask });

  const flash = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  // Filter + group tasks into columns, preserving the user's drag order.
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
        const orderDelta = (a.order ?? 0) - (b.order ?? 0);
        if (orderDelta !== 0) return orderDelta;
        // Stable tie-breaker for legacy tasks with no manual order yet.
        const p =
          KANBAN_PRIORITY_MAP[a.priority].order -
          KANBAN_PRIORITY_MAP[b.priority].order;
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
          // Non-empty board → ask before discarding current work.
          if (store.tasks.length > 0) {
            setPendingImport(parsed);
            setConfirmOverwrite("import");
            return;
          }
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

  const applyLoadSamples = useCallback(() => {
    store.loadSamples();
    flash("Sample tasks loaded");
  }, [store, flash]);

  const handleLoadSamples = useCallback(() => {
    // Non-empty board → ask before overwriting.
    if (store.tasks.length > 0) {
      setConfirmOverwrite("samples");
      return;
    }
    applyLoadSamples();
  }, [store.tasks.length, applyLoadSamples]);

  const handleMove = useCallback(
    (id: string, toStatus: KanbanStatus) => {
      store.moveTask(id, toStatus);
      flash("Task moved");
    },
    [store, flash]
  );

  return (
    <div className="flex w-full flex-col gap-5">
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
        onLoadSamples={handleLoadSamples}
        onClear={() => setConfirmClear(true)}
      />

      {store.persistError && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
          Could not write to localStorage (storage may be full or disabled).
          Your changes are kept for this session only.
        </p>
      )}

      {/* Empty board (nothing created yet) — replaces the column grid so the
          screen isn't a wall of empty columns. */}
      {store.tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300/70 py-14 text-center text-neutral-400 dark:border-neutral-700/60">
          <TbLayoutKanban className="h-10 w-10 opacity-40" />
          <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Your board is empty.
            </p>
            <p className="mt-1 text-xs">
              Create a task to get started — or load the sample tasks.
            </p>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setModal({ open: true, mode: "add", status: "backlog" })}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-500 active:scale-95"
            >
              <TbPlus className="h-4 w-4" />
              New Task
            </button>
            <button
              type="button"
              onClick={handleLoadSamples}
              className="cursor-pointer rounded-xl border border-neutral-200/70 bg-white/70 px-3.5 py-2 text-xs font-semibold text-neutral-600 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800/70 dark:bg-neutral-900/70 dark:text-neutral-300"
            >
              Load samples
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Board — horizontally scrollable on small screens, full-width
              grid on large screens. Columns scroll internally on desktop. */}
          <div className="-mx-1 flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-4 lg:mx-0 lg:grid lg:h-[calc(100vh-20rem)] lg:min-h-[24rem] lg:snap-none lg:grid-cols-5 lg:gap-4 lg:overflow-hidden lg:px-0">
            {KANBAN_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={grouped[column.id]}
                dnd={dnd}
                onEdit={(task) => setModal({ open: true, mode: "edit", task })}
                onDelete={setPendingDelete}
                onMove={handleMove}
                onAdd={(status) => setModal({ open: true, mode: "add", status })}
              />
            ))}
          </div>

          {/* No matches (board has tasks, filters hide them all) */}
          {visibleCount === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-neutral-400">
              <TbLayoutKanban className="h-8 w-8 opacity-40" />
              <p className="text-sm">No tasks match your search or filter.</p>
            </div>
          )}
        </>
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

      {/* Clear-board confirmation */}
      <ConfirmDialog
        open={confirmClear}
        title="Clear the board?"
        message="This permanently deletes every task. This cannot be undone."
        confirmLabel="Clear all"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          store.clearBoard();
          setConfirmClear(false);
          flash("Board cleared");
        }}
      />

      {/* Overwrite confirmation (load samples / import onto a non-empty board) */}
      <ConfirmDialog
        open={confirmOverwrite !== null}
        title={confirmOverwrite === "import" ? "Replace current board?" : "Load sample tasks?"}
        message={
          confirmOverwrite === "import"
            ? "Importing replaces every task currently on the board. Continue?"
            : "Loading samples replaces every task currently on the board. Continue?"
        }
        confirmLabel={confirmOverwrite === "import" ? "Import" : "Load samples"}
        onCancel={() => {
          setConfirmOverwrite(null);
          setPendingImport(null);
        }}
        onConfirm={() => {
          if (confirmOverwrite === "import") {
            if (store.replaceState(pendingImport)) flash("Board imported");
            else flash("Import failed: invalid file");
          } else {
            applyLoadSamples();
          }
          setConfirmOverwrite(null);
          setPendingImport(null);
        }}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
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
