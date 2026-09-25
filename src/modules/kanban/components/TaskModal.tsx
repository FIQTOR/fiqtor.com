/**
 * TaskModal — add / edit form for a task.
 *
 * Controlled by the parent: `mode` decides the title + submit label, `initial`
 * seeds the form. Includes the progressive counter (current/target/unit) so a
 * task like "Outreach: message 46 cafés" can jump from 10 → 15 in one edit.
 */
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TbX } from "react-icons/tb";
import {
  KANBAN_COLUMNS,
  KANBAN_PRIORITIES,
  createEmptyDraft,
} from "@/data/kanban";
import { progressPercent } from "@/modules/kanban/kanban.utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import type { Task, TaskDraft } from "@/types/kanban";

interface TaskModalProps {
  open: boolean;
  mode: "add" | "edit";
  /** Pre-selected status when adding from a column header. */
  initialStatus?: Task["status"];
  /** Task being edited (edit mode). */
  task?: Task | null;
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => void;
}

const inputClass =
  "w-full rounded-xl border border-neutral-300/70 bg-white/80 px-3 py-2 text-sm text-neutral-800 outline-none transition-colors placeholder:text-neutral-400 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700/70 dark:bg-neutral-900/70 dark:text-neutral-100";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400";

/** Build the initial form draft from the modal's target (add vs edit). */
const seedDraft = (
  mode: "add" | "edit",
  status: Task["status"],
  task: Task | null
): TaskDraft => {
  if (mode === "edit" && task) {
    const { id, createdAt, updatedAt, ...rest } = task;
    void id;
    void createdAt;
    void updatedAt;
    return rest;
  }
  return { ...createEmptyDraft(), status };
};

/**
 * TaskModalForm — mounted only while the modal is open, so its `useState`
 * initializer seeds the draft exactly once per open (no effect needed).
 */
const TaskModalForm = ({
  mode,
  initialStatus,
  task,
  onClose,
  onSubmit,
}: {
  mode: "add" | "edit";
  initialStatus: Task["status"];
  task: Task | null;
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => void;
}) => {
  const [draft, setDraft] = useState<TaskDraft>(() =>
    seedDraft(mode, initialStatus, task)
  );
  const [titleError, setTitleError] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Trap focus + close on Escape (returns focus to the trigger on unmount).
  const trapRef = useFocusTrap<HTMLDivElement>(true, onClose);

  const percent = progressPercent(draft.progress);

  const setProgress = (patch: Partial<TaskDraft["progress"]>) =>
    setDraft((d) => ({ ...d, progress: { ...d.progress, ...patch } }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) {
      setTitleError(true);
      containerRef.current?.querySelector<HTMLInputElement>("input")?.focus();
      return;
    }
    onSubmit({ ...draft, title: draft.title.trim() });
    onClose();
  };

  return (
    <motion.div
      ref={(node) => {
        containerRef.current = node;
        trapRef.current = node;
      }}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      tabIndex={-1}
      className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-neutral-200/70 bg-white/95 p-5 shadow-2xl backdrop-blur-xl outline-none dark:border-neutral-800/70 dark:bg-neutral-950/95 sm:rounded-2xl"
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2
          id="task-modal-title"
          className="text-lg font-bold text-neutral-800 dark:text-neutral-100"
        >
          {mode === "edit" ? "Edit Task" : "New Task"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
        >
          <TbX className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label htmlFor="task-title" className={labelClass}>
            Title
          </label>
          <input
            id="task-title"
            type="text"
            value={draft.title}
            onChange={(e) => {
              setDraft((d) => ({ ...d, title: e.target.value }));
              if (titleError) setTitleError(false);
            }}
            placeholder="e.g. Outreach: message 46 cafés"
            className={`${inputClass} ${
              titleError ? "border-red-500/70 ring-2 ring-red-500/20" : ""
            }`}
          />
          {titleError && (
            <p className="mt-1 text-xs text-red-500">Title is required.</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="task-desc" className={labelClass}>
            Description
          </label>
          <textarea
            id="task-desc"
            rows={3}
            value={draft.description}
            onChange={(e) =>
              setDraft((d) => ({ ...d, description: e.target.value }))
            }
            placeholder="Add context, links, or acceptance criteria…"
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Status + Priority */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="task-status" className={labelClass}>
              Column
            </label>
            <select
              id="task-status"
              value={draft.status}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  status: e.target.value as Task["status"],
                }))
              }
              className={inputClass}
            >
              {KANBAN_COLUMNS.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className={labelClass}>Priority</span>
            <div className="flex gap-1.5">
              {KANBAN_PRIORITIES.map((p) => {
                const active = draft.priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, priority: p.id }))}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-semibold transition-all ${
                      active
                        ? p.badgeClass
                        : "border-neutral-300/70 text-neutral-500 hover:bg-neutral-100 dark:border-neutral-700/70 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${p.dotClass}`} />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Due date */}
        <div>
          <label htmlFor="task-due" className={labelClass}>
            Due date
          </label>
          <input
            id="task-due"
            type="date"
            value={draft.dueDate}
            onChange={(e) =>
              setDraft((d) => ({ ...d, dueDate: e.target.value }))
            }
            className={inputClass}
          />
        </div>

        {/* Progress tracker */}
        <fieldset className="rounded-xl border border-neutral-200/70 p-3 dark:border-neutral-800/70">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Progress tracker
          </legend>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="task-current" className={labelClass}>
                Current
              </label>
              <input
                id="task-current"
                type="number"
                min={0}
                value={draft.progress.current}
                onChange={(e) =>
                  setProgress({ current: Math.max(0, Number(e.target.value)) })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="task-target" className={labelClass}>
                Target
              </label>
              <input
                id="task-target"
                type="number"
                min={0}
                value={draft.progress.target}
                onChange={(e) =>
                  setProgress({ target: Math.max(0, Number(e.target.value)) })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="task-unit" className={labelClass}>
                Unit
              </label>
              <input
                id="task-unit"
                type="text"
                value={draft.progress.unit}
                onChange={(e) => setProgress({ unit: e.target.value })}
                placeholder="Cafés"
                className={inputClass}
              />
            </div>
          </div>
          {draft.progress.target > 0 && (
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              {draft.progress.current}/{draft.progress.target}
              {draft.progress.unit ? ` ${draft.progress.unit}` : ""} —{" "}
              <span className="font-semibold text-blue-500">{percent}%</span>
            </p>
          )}
        </fieldset>

        {/* Actions */}
        <div className="mt-1 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-95"
          >
            {mode === "edit" ? "Save changes" : "Create task"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const TaskModal = ({
  open,
  mode,
  initialStatus = "backlog",
  task = null,
  onClose,
  onSubmit,
}: TaskModalProps) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      >
        <TaskModalForm
          key={mode === "edit" ? task?.id ?? "edit" : `add-${initialStatus}`}
          mode={mode}
          initialStatus={initialStatus}
          task={task}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </motion.div>
    )}
  </AnimatePresence>
);

export default TaskModal;
