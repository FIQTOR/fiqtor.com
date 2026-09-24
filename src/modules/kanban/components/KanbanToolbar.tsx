/**
 * KanbanToolbar — search, priority filter, and board-level actions
 * (new task, export, import, reset). Import is driven by a hidden file input.
 */
import { useRef } from "react";
import {
  TbDownload,
  TbFilter,
  TbPlus,
  TbRefresh,
  TbSearch,
  TbUpload,
} from "react-icons/tb";
import { KANBAN_PRIORITIES } from "@/data/kanban";
import type { KanbanPriority } from "@/types/kanban";

interface KanbanToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  priorityFilter: KanbanPriority | "all";
  onPriorityFilterChange: (value: KanbanPriority | "all") => void;
  taskCount: number;
  savedLabel: string | null;
  onAddTask: () => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
  onReset: () => void;
}

const KanbanToolbar = ({
  query,
  onQueryChange,
  priorityFilter,
  onPriorityFilterChange,
  taskCount,
  savedLabel,
  onAddTask,
  onExport,
  onImportFile,
  onReset,
}: KanbanToolbarProps) => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const actionBtn =
    "inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-neutral-200/70 bg-white/70 px-3 py-2 text-xs font-semibold text-neutral-600 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800/70 dark:bg-neutral-900/70 dark:text-neutral-300";

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Left: search + priority filter */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <TbSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search tasks…"
            className="w-full rounded-xl border border-neutral-200/70 bg-white/70 py-2 pl-9 pr-3 text-sm text-neutral-800 outline-none backdrop-blur-sm transition-colors placeholder:text-neutral-400 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-800/70 dark:bg-neutral-900/70 dark:text-neutral-100"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <TbFilter className="h-4 w-4 text-neutral-400" />
          <div className="flex gap-1 rounded-xl border border-neutral-200/70 bg-white/70 p-0.5 backdrop-blur-sm dark:border-neutral-800/70 dark:bg-neutral-900/70">
            {(["all", ...KANBAN_PRIORITIES.map((p) => p.id)] as const).map(
              (id) => {
                const active = priorityFilter === id;
                const label =
                  id === "all"
                    ? "All"
                    : KANBAN_PRIORITIES.find((p) => p.id === id)?.label ?? id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onPriorityFilterChange(id)}
                    className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      active
                        ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                    }`}
                  >
                    {label}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Right: stats + actions */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-auto flex flex-col text-right lg:mr-0">
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
            {taskCount} task{taskCount === 1 ? "" : "s"}
          </span>
          {savedLabel && (
            <span className="text-[10px] text-neutral-400">{savedLabel}</span>
          )}
        </div>

        <button type="button" onClick={onExport} className={actionBtn}>
          <TbDownload className="h-4 w-4" />
          Export
        </button>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={actionBtn}
        >
          <TbUpload className="h-4 w-4" />
          Import
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImportFile(file);
            e.target.value = "";
          }}
        />

        <button type="button" onClick={onReset} className={actionBtn}>
          <TbRefresh className="h-4 w-4" />
          Reset
        </button>

        <button
          type="button"
          onClick={onAddTask}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-500 active:scale-95"
        >
          <TbPlus className="h-4 w-4" />
          New Task
        </button>
      </div>
    </div>
  );
};

export default KanbanToolbar;
