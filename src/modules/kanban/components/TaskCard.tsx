/**
 * TaskCard — a single draggable task inside a column.
 *
 * Renders title, priority badge, optional progress bar, and a compact meta
 * footer (due date + last update). Edit/delete are triggered via callbacks so
 * the card stays free of store knowledge.
 *
 * Drag-and-drop is mouse-only (HTML5 DnD doesn't fire on touch), so every card
 * also exposes a keyboard/touch-accessible "Move to" menu.
 */
import { memo, useEffect, useRef, useState } from "react";
import {
  TbCalendarDue,
  TbClockHour4,
  TbPencil,
  TbTrash,
  TbArrowsExchange,
} from "react-icons/tb";
import PriorityBadge from "@/modules/kanban/components/PriorityBadge";
import ProgressBar from "@/modules/kanban/components/ProgressBar";
import { KANBAN_COLUMNS, KANBAN_PRIORITY_MAP } from "@/data/kanban";
import { dueDateMeta } from "@/modules/kanban/kanban.utils";
import type { KanbanStatus, Task } from "@/types/kanban";

interface TaskCardProps {
  task: Task;
  isDragging: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (id: string, toStatus: KanbanStatus) => void;
  dragHandlers: {
    draggable: true;
    onDragStart: (e: React.DragEvent<HTMLElement>) => void;
    onDragEnd: () => void;
  };
}

const DUE_TONE_CLASS: Record<"overdue" | "soon" | "normal", string> = {
  overdue: "text-red-500",
  soon: "text-amber-500",
  normal: "text-neutral-500 dark:text-neutral-400",
};

const TaskCard = memo(function TaskCard({
  task,
  isDragging,
  onEdit,
  onDelete,
  onMove,
  dragHandlers,
}: TaskCardProps) {
  const due = dueDateMeta(task.dueDate);
  const accent = KANBAN_PRIORITY_MAP[task.priority].dotClass;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close the move menu when clicking outside.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  const moveTargets = KANBAN_COLUMNS.filter((c) => c.id !== task.status);

  return (
    <article
      {...dragHandlers}
      aria-label={`Task: ${task.title || "Untitled"}`}
      className={`group relative cursor-grab overflow-hidden rounded-xl border border-neutral-200/70 bg-white/80 p-3 text-left shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md active:cursor-grabbing dark:border-neutral-800/70 dark:bg-neutral-900/70 dark:hover:border-neutral-700 ${
        isDragging ? "opacity-40 ring-2 ring-blue-500/40" : ""
      }`}
    >
      {/* Priority accent bar */}
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${accent}`}
      />

      <div className="pl-2">
        {/* Header: title + priority */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold leading-snug text-neutral-800 dark:text-neutral-100">
            {task.title || "Untitled task"}
          </h4>
          <PriorityBadge priority={task.priority} withDot={false} />
        </div>

        {/* Description */}
        {task.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            {task.description}
          </p>
        )}

        {/* Progress tracker (renders nothing without a target) */}
        <ProgressBar progress={task.progress} className="mt-2.5" />

        {/* Meta footer */}
        <div className="mt-2.5 flex items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2.5">
            {due && (
              <span
                className={`inline-flex items-center gap-1 font-medium ${DUE_TONE_CLASS[due.tone]}`}
                title={`Due ${due.label}`}
              >
                <TbCalendarDue className="h-3.5 w-3.5" />
                {due.label}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <TbClockHour4 className="h-3.5 w-3.5" />
              {new Date(task.updatedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>

          {/* Quick actions — always visible on touch, hover-reveal on desktop */}
          <div className="flex items-center gap-1 opacity-100 transition-opacity duration-200 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={`Move ${task.title}`}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-blue-600 dark:hover:bg-neutral-800 dark:hover:text-blue-400 lg:h-6 lg:w-6"
              >
                <TbArrowsExchange className="h-3.5 w-3.5" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 bottom-full z-30 mb-1.5 w-40 overflow-hidden rounded-xl border border-neutral-200/70 bg-white/95 p-1 shadow-2xl backdrop-blur-xl dark:border-neutral-700/60 dark:bg-neutral-900/95"
                >
                  <p className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    Move to
                  </p>
                  {moveTargets.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onMove(task.id, col.id);
                        setMenuOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <span className={`h-2 w-2 rounded-full ${col.accentClass}`} />
                      {col.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-blue-600 dark:hover:bg-neutral-800 dark:hover:text-blue-400 lg:h-6 lg:w-6"
            >
              <TbPencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              aria-label={`Delete ${task.title}`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 lg:h-6 lg:w-6"
            >
              <TbTrash className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

export default TaskCard;
