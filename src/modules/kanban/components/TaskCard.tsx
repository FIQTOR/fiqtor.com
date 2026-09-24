/**
 * TaskCard — a single draggable task inside a column.
 *
 * Renders title, priority badge, optional progress bar, and a compact meta
 * footer (due date + last update). Edit/delete are triggered via callbacks so
 * the card stays free of store knowledge.
 */
import { memo } from "react";
import { TbCalendarDue, TbClockHour4, TbPencil, TbTrash } from "react-icons/tb";
import PriorityBadge from "@/modules/kanban/components/PriorityBadge";
import ProgressBar from "@/modules/kanban/components/ProgressBar";
import { KANBAN_PRIORITY_MAP } from "@/data/kanban";
import { dueDateMeta } from "@/modules/kanban/kanban.utils";
import type { Task } from "@/types/kanban";

interface TaskCardProps {
  task: Task;
  isDragging: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
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
  dragHandlers,
}: TaskCardProps) {
  const due = dueDateMeta(task.dueDate);
  const accent = KANBAN_PRIORITY_MAP[task.priority].dotClass;

  return (
    <article
      {...dragHandlers}
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
        <div className="mt-2.5 flex items-center justify-between gap-2 text-[10px] text-neutral-500 dark:text-neutral-400">
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
