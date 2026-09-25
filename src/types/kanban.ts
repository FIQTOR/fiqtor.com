/**
 * Kanban Board Management System — domain types.
 *
 * Pure type module (no runtime code) so it can be imported from anywhere
 * without pulling in React. Keep this the single source of truth for the
 * shape of a Task and its related unions.
 */

/** Workflow columns, in display order (left → right). */
export const KANBAN_STATUSES = [
  "backlog",
  "todo",
  "in-progress",
  "on-hold",
  "done",
] as const;

export type KanbanStatus = (typeof KANBAN_STATUSES)[number];

/** Task priority levels. */
export const KANBAN_PRIORITIES = ["high", "medium", "low"] as const;

export type KanbanPriority = (typeof KANBAN_PRIORITIES)[number];

/**
 * Progressive / outreach progress counter (e.g. "Outreach: message 46 cafés" → 10/46).
 * `target` of 0 (or a non-positive value) means "no target" → the card hides
 * the progress bar entirely.
 */
export interface TaskProgress {
  /** Amount done so far, e.g. 10. */
  current: number;
  /** Goal amount, e.g. 46. 0 = no target → hides the bar. */
  target: number;
  /** Display unit for the counter, e.g. "Cafés", "%", "days". */
  unit: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: KanbanStatus;
  priority: KanbanPriority;
  /** Optional: a task without a target simply omits the bar. */
  progress: TaskProgress;
  /** ISO date string (yyyy-mm-dd) or empty string when unset. */
  dueDate: string;
  /**
   * Manual sort position *within its column* (ascending). Preserves the exact
   * drag-and-drop order the user chose. Optional for backward compatibility
   * with boards saved before this field existed.
   */
  order?: number;
  /** ISO timestamp of creation. */
  createdAt: string;
  /** ISO timestamp of the last mutation. */
  updatedAt: string;
}

/** Payload accepted when creating/editing a task via the modal form. */
export type TaskDraft = Omit<Task, "id" | "createdAt" | "updatedAt">;

/** Shape of the persisted / exported board state. */
export interface KanbanState {
  /** Schema version, bumped when the persisted shape changes. */
  version: number;
  tasks: Task[];
  /** Epoch ms of the last write — used for the "last saved" label. */
  savedAt: number;
}
