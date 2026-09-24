/**
 * useKanbanStore — the single source of truth for the Kanban board.
 *
 * Responsibilities:
 *  - Hold the task list in React state.
 *  - Persist to localStorage on every mutation (debounced via effect).
 *  - Provide CRUD actions + move/reorder + export/import of the JSON file.
 *
 * The hook is intentionally the ONLY place that touches localStorage, so the
 * UI components stay pure and easy to test/reason about.
 */
import { useCallback, useMemo, useState } from "react";
import {
  KANBAN_SCHEMA_VERSION,
  KANBAN_STORAGE_KEY,
  createEmptyState,
  createSampleState,
  createTaskId,
} from "@/data/kanban";
import type {
  KanbanState,
  KanbanStatus,
  Task,
  TaskDraft,
} from "@/types/kanban";

/** localStorage may throw (Safari private mode, quota) — never crash the app. */
const safeGet = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key: string, value: string): boolean => {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

/** Validate an unknown parsed object into a KanbanState (import + load guard). */
export const parseKanbanState = (raw: unknown): KanbanState | null => {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<KanbanState>;
  if (!Array.isArray(candidate.tasks)) return null;

  const tasks: Task[] = candidate.tasks
    .filter((t): t is Task => !!t && typeof t === "object")
    .map((t, index) => ({
      id: typeof t.id === "string" && t.id ? t.id : createTaskId(),
      title: String(t.title ?? "Untitled"),
      description: String(t.description ?? ""),
      status: (t.status ?? "backlog") as KanbanStatus,
      priority: (t.priority ?? "medium") as Task["priority"],
      progress: {
        current: Number(t.progress?.current) || 0,
        target: Number(t.progress?.target) || 0,
        unit: String(t.progress?.unit ?? ""),
      },
      dueDate: String(t.dueDate ?? ""),
      // Missing order (legacy boards) → fall back to the stored array index so
      // the visual order is preserved on first load.
      order: Number.isFinite(Number(t.order)) ? Number(t.order) : index,
      createdAt: t.createdAt ?? new Date().toISOString(),
      updatedAt: t.updatedAt ?? new Date().toISOString(),
    }));

  return {
    version: candidate.version ?? KANBAN_SCHEMA_VERSION,
    tasks,
    savedAt: candidate.savedAt ?? Date.now(),
  };
};

/** Read the initial state: localStorage if valid, otherwise an EMPTY board. */
const loadInitialState = (): KanbanState => {
  const raw = safeGet(KANBAN_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = parseKanbanState(JSON.parse(raw));
      if (parsed) return parsed;
    } catch {
      /* corrupted — fall through to an empty board */
    }
  }
  return createEmptyState();
};

export interface KanbanStore {
  tasks: Task[];
  /** Epoch ms of the last mutation (mirrored to storage). */
  savedAt: number | null;
  /** True when the last write to localStorage failed (quota/private mode). */
  persistError: boolean;
  addTask: (draft: TaskDraft) => void;
  updateTask: (id: string, draft: TaskDraft) => void;
  deleteTask: (id: string) => void;
  /** Move a task to a column, optionally inserting before `beforeId`. */
  moveTask: (id: string, toStatus: KanbanStatus, beforeId?: string | null) => void;
  /** Replace the whole board (used by import); returns false on invalid data. */
  replaceState: (raw: unknown) => boolean;
  /** Serialize the current board to a pretty JSON string. */
  exportJson: () => string;
  /** Replace the board with the optional sample tasks (wipes current tasks). */
  loadSamples: () => void;
  /** Delete every task, leaving an empty board. */
  clearBoard: () => void;
}

export function useKanbanStore(): KanbanStore {
  const [state, setState] = useState<KanbanState>(loadInitialState);
  const [persistError, setPersistError] = useState(false);

  /**
   * Compute the next state from the current one, persist it to localStorage,
   * then commit it to React. Runs in event handlers, so the localStorage write
   * is a normal side effect (no effect hook, no render-phase mutation).
   */
  const commit = useCallback(
    (updater: (prev: KanbanState) => KanbanState) => {
      const next = updater(state);
      const ok = safeSet(KANBAN_STORAGE_KEY, JSON.stringify(next));
      setPersistError((prev) => (prev === !ok ? prev : !ok));
      setState(next);
    },
    [state]
  );

  const mutate = useCallback(
    (updater: (tasks: Task[]) => Task[]) => {
      commit((prev) => ({
        ...prev,
        tasks: updater(prev.tasks),
        savedAt: Date.now(),
      }));
    },
    [commit]
  );

  const addTask = useCallback(
    (draft: TaskDraft) => {
      const now = new Date().toISOString();
      mutate((tasks) => {
        // Put the new card at the TOP of its column: give it order 0 and push
        // every sibling down by one.
        const task: Task = {
          ...draft,
          order: 0,
          id: createTaskId(),
          createdAt: now,
          updatedAt: now,
        };
        const shifted = tasks.map((t) =>
          t.status === draft.status ? { ...t, order: (t.order ?? 0) + 1 } : t
        );
        return [task, ...shifted];
      });
    },
    [mutate]
  );

  const updateTask = useCallback(
    (id: string, draft: TaskDraft) => {
      mutate((tasks) =>
        tasks.map((t) =>
          t.id === id
            ? { ...t, ...draft, updatedAt: new Date().toISOString() }
            : t
        )
      );
    },
    [mutate]
  );

  const deleteTask = useCallback(
    (id: string) => {
      mutate((tasks) => tasks.filter((t) => t.id !== id));
    },
    [mutate]
  );

  const moveTask = useCallback(
    (id: string, toStatus: KanbanStatus, beforeId?: string | null) => {
      mutate((tasks) => {
        const moving = tasks.find((t) => t.id === id);
        if (!moving) return tasks;

        // Build the target column's ordered list (excluding the moving card),
        // honouring each task's manual `order` so the drop lands exactly where
        // the user released it — not where a priority re-sort would put it.
        const target = tasks
          .filter((t) => t.status === toStatus && t.id !== id)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const insertAt = beforeId
          ? target.findIndex((t) => t.id === beforeId)
          : target.length;
        const at = insertAt === -1 ? target.length : insertAt;

        const updated: Task = {
          ...moving,
          status: toStatus,
          updatedAt: new Date().toISOString(),
        };
        target.splice(at, 0, updated);

        // Re-number the target column 0..n-1.
        const renumbered = new Map<string, number>();
        target.forEach((t, i) => renumbered.set(t.id, i));

        return tasks.map((t) => {
          if (t.id === id) {
            return { ...updated, order: renumbered.get(id) ?? 0 };
          }
          const nextOrder = renumbered.get(t.id);
          return nextOrder === undefined ? t : { ...t, order: nextOrder };
        });
      });
    },
    [mutate]
  );

  const replaceState = useCallback(
    (raw: unknown) => {
      const parsed = parseKanbanState(raw);
      if (!parsed) return false;
      commit(() => ({ ...parsed, savedAt: Date.now() }));
      return true;
    },
    [commit]
  );

  const exportJson = useCallback(
    () => JSON.stringify({ ...state, savedAt: Date.now() }, null, 2),
    [state]
  );

  const loadSamples = useCallback(() => {
    commit(() => createSampleState());
  }, [commit]);

  const clearBoard = useCallback(() => {
    commit(() => ({ ...createEmptyState(), savedAt: Date.now() }));
  }, [commit]);

  return useMemo(
    () => ({
      tasks: state.tasks,
      savedAt: state.savedAt ?? null,
      persistError,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      replaceState,
      exportJson,
      loadSamples,
      clearBoard,
    }),
    [
      state.tasks,
      state.savedAt,
      persistError,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      replaceState,
      exportJson,
      loadSamples,
      clearBoard,
    ]
  );
}
