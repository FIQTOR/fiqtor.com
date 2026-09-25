/**
 * KanbanColumn — a single workflow column.
 *
 * Owns the drop zone for its status, renders its task cards, and shows an
 * insertion indicator between cards while a drag is in progress. Also exposes
 * a per-column "add" shortcut and a task count in the header.
 */
import { memo } from "react";
import { TbPlus } from "react-icons/tb";
import TaskCard from "@/modules/kanban/components/TaskCard";
import type { KanbanColumnDef } from "@/data/kanban";
import type { KanbanStatus, Task } from "@/types/kanban";
import type { KanbanDnD } from "@/modules/kanban/hooks/useKanbanDnD";

interface KanbanColumnProps {
  column: KanbanColumnDef;
  tasks: Task[];
  dnd: KanbanDnD;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (id: string, toStatus: KanbanStatus) => void;
  onAdd: (columnId: KanbanColumnDef["id"]) => void;
}

const KanbanColumn = memo(function KanbanColumn({
  column,
  tasks,
  dnd,
  onEdit,
  onDelete,
  onMove,
  onAdd,
}: KanbanColumnProps) {
  const isDropTarget = dnd.overStatus === column.id;

  return (
    <div
      {...dnd.getColumnHandlers(column.id)}
      className={`flex h-full w-[80vw] max-w-[19rem] shrink-0 snap-start flex-col rounded-2xl border bg-neutral-100/60 backdrop-blur-sm transition-colors duration-200 sm:w-72 sm:max-w-none lg:w-auto lg:shrink dark:bg-neutral-900/40 ${
        isDropTarget
          ? "border-blue-500/40 bg-blue-500/5 dark:border-blue-500/30"
          : "border-neutral-200/60 dark:border-neutral-800/60"
      }`}
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-2 px-3.5 py-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${column.accentClass}`} />
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
            {column.label}{" "}
            <span className="font-medium text-neutral-400 dark:text-neutral-500">
              ({tasks.length})
            </span>
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onAdd(column.id)}
          aria-label={`Add task to ${column.label}`}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-200/70 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
        >
          <TbPlus className="h-4 w-4" />
        </button>
      </header>

      {/* Cards */}
      <div className="flex min-h-[80px] flex-1 flex-col gap-1 overflow-y-auto px-2 pb-3">
        {tasks.map((task, index) => (
          <div key={task.id} className="flex flex-col">
            {/* Insertion gap before this card */}
            <div
              {...dnd.getGapHandlers(column.id, task.id)}
              className="h-2 -my-1 flex items-center"
            >
              {isDropTarget && dnd.overBeforeId === task.id && (
                <span className="h-0.5 w-full rounded-full bg-blue-500" />
              )}
            </div>

            <TaskCard
              task={task}
              isDragging={dnd.draggingId === task.id}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              dragHandlers={dnd.getCardHandlers(task.id)}
            />

            {/* Trailing gap (append at end) */}
            {index === tasks.length - 1 && (
              <div
                {...dnd.getGapHandlers(column.id, null)}
                className="h-2 -my-1 flex items-center"
              >
                {isDropTarget && dnd.overBeforeId === null && (
                  <span className="h-0.5 w-full rounded-full bg-blue-500" />
                )}
              </div>
            )}
          </div>
        ))}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div
            className={`flex flex-1 items-center justify-center rounded-xl border border-dashed px-3 py-6 text-center text-xs transition-colors ${
              isDropTarget
                ? "border-blue-500/50 text-blue-500"
                : "border-neutral-300/70 text-neutral-400 dark:border-neutral-700/70"
            }`}
          >
            {isDropTarget ? "Drop here" : "No tasks yet"}
          </div>
        )}
      </div>
    </div>
  );
});

export default KanbanColumn;
