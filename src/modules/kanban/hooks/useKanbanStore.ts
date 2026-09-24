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
  createSeedState,
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
    .map((t) => ({
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
      createdAt: t.createdAt ?? new Date().toISOString(),
      updatedAt: t.updatedAt ?? new Date().toISOString(),
    }));

  return {
    version: candidate.version ?? KANBAN_SCHEMA_VERSION,
    tasks,
    savedAt: candidate.savedAt ?? Date.now(),
  };
};

/** Read the initial state: localStorage if valid, otherwise the seed. */
const loadInitialState = (): KanbanState => {
  const raw = safeGet(KANBAN_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = parseKanbanState(JSON.parse(raw));
      if (parsed) return parsed;
    } catch {
      /* corrupted — fall through to seed */
    }
  }
  return createSeedState();
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
  /** Wipe storage and reset to seed data. */
  resetToSeed: () => void;
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
      const task: Task = {
        ...draft,
        id: createTaskId(),
        createdAt: now,
        updatedAt: now,
      };
      mutate((tasks) => [task, ...tasks]);
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

        const rest = tasks.filter((t) => t.id !== id);
        const updated: Task = {
          ...moving,
          status: toStatus,
          updatedAt: new Date().toISOString(),
        };

        // No explicit anchor → drop at the end of the target column's segment.
        if (!beforeId) {
          const lastIndex = rest.reduce(
            (acc, t, i) => (t.status === toStatus ? i : acc),
            -1
          );
          const insertAt = lastIndex === -1 ? rest.length : lastIndex + 1;
          rest.splice(insertAt, 0, updated);
          return rest;
        }

        const anchorIndex = rest.findIndex((t) => t.id === beforeId);
        const insertAt = anchorIndex === -1 ? rest.length : anchorIndex;
        rest.splice(insertAt, 0, updated);
        return rest;
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

  const resetToSeed = useCallback(() => {
    commit(() => createSeedState());
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
      resetToSeed,
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
      resetToSeed,
    ]
  );
}
