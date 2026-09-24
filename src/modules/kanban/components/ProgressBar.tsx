/**
 * ProgressBar — mini progress meter for a task's outreach counter.
 *
 * Pure/presentational: renders nothing when the task has no target, so the
 * caller can drop it into a card unconditionally.
 */
import type { TaskProgress } from "@/types/kanban";
import {
  hasProgressTarget,
  progressLabel,
  progressPercent,
} from "@/modules/kanban/kanban.utils";

interface ProgressBarProps {
  progress: TaskProgress;
  className?: string;
  showLabel?: boolean;
}

const ProgressBar = ({
  progress,
  className = "",
  showLabel = true,
}: ProgressBarProps) => {
  if (!hasProgressTarget(progress)) return null;

  const percent = progressPercent(progress);
  const isComplete = percent >= 100;
  const max = progress.target > 0 ? progress.target : 100;
  const value = max === progress.target ? Math.min(progress.current, max) : percent;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between gap-3 text-[10px] text-neutral-500 dark:text-neutral-400">
          <span className="truncate">{progressLabel(progress)}</span>
          <span className="shrink-0 font-medium tabular-nums text-neutral-700 dark:text-neutral-300">
            {percent}%
          </span>
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={progressLabel(progress)}
        className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${
            isComplete ? "bg-emerald-500" : "bg-blue-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
