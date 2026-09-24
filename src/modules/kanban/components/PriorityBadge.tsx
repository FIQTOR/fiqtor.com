/**
 * PriorityBadge — small pill that surfaces a task's priority.
 *
 * Pure/presentational: all colour decisions come from KANBAN_PRIORITY_MAP.
 */
import type { KanbanPriority } from "@/types/kanban";
import { KANBAN_PRIORITY_MAP } from "@/data/kanban";

interface PriorityBadgeProps {
  priority: KanbanPriority;
  className?: string;
  withDot?: boolean;
}

const PriorityBadge = ({
  priority,
  className = "",
  withDot = true,
}: PriorityBadgeProps) => {
  const def = KANBAN_PRIORITY_MAP[priority];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${def.badgeClass} ${className}`}
    >
      {withDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${def.dotClass}`} />
      )}
      {def.label}
    </span>
  );
};

export default PriorityBadge;
