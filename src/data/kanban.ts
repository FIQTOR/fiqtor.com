/**
 * Kanban board configuration + seed data.
 *
 * Static data only (no imports from React) so it can be shared by hooks,
 * components, the page wrapper, and the export/import helpers.
 */
import type {
  KanbanPriority,
  KanbanStatus,
  KanbanState,
  Task,
} from "@/types/kanban";

/** localStorage key holding the persisted board. */
export const KANBAN_STORAGE_KEY = "fiqtor.kanban.v1";

/** Current persisted-schema version (see KanbanState.version). */
export const KANBAN_SCHEMA_VERSION = 1;

/** A single workflow column definition. */
export interface KanbanColumnDef {
  id: KanbanStatus;
  label: string;
  /** Tailwind classes for the column accent (header dot + top border). */
  accentClass: string;
}

/** Columns rendered on the board, in order. */
export const KANBAN_COLUMNS: readonly KanbanColumnDef[] = [
  {
    id: "backlog",
    label: "Backlog",
    accentClass: "bg-neutral-400 dark:bg-neutral-500",
  },
  {
    id: "todo",
    label: "To Do",
    accentClass: "bg-sky-500",
  },
  {
    id: "in-progress",
    label: "In Progress",
    accentClass: "bg-blue-500",
  },
  {
    id: "on-hold",
    label: "On Hold / Waiting",
    accentClass: "bg-amber-500",
  },
  {
    id: "done",
    label: "Done",
    accentClass: "bg-emerald-500",
  },
] as const;

/** Priority presentation metadata. */
export interface KanbanPriorityDef {
  id: KanbanPriority;
  label: string;
  /** Badge classes (text + bg + border), theme-aware. */
  badgeClass: string;
  /** Solid dot/left-bar color classes. */
  dotClass: string;
  /** 0 = highest, used for sorting. */
  order: number;
}

export const KANBAN_PRIORITIES: readonly KanbanPriorityDef[] = [
  {
    id: "high",
    label: "High",
    badgeClass:
      "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    dotClass: "bg-red-500",
    order: 0,
  },
  {
    id: "medium",
    label: "Medium",
    badgeClass:
      "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    dotClass: "bg-yellow-500",
    order: 1,
  },
  {
    id: "low",
    label: "Low",
    badgeClass:
      "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20",
    dotClass: "bg-neutral-400 dark:bg-neutral-500",
    order: 2,
  },
] as const;

/** Fast lookup maps built once from the arrays above. */
export const KANBAN_COLUMN_MAP: Record<KanbanStatus, KanbanColumnDef> =
  Object.fromEntries(KANBAN_COLUMNS.map((c) => [c.id, c])) as Record<
    KanbanStatus,
    KanbanColumnDef
  >;

export const KANBAN_PRIORITY_MAP: Record<KanbanPriority, KanbanPriorityDef> =
  Object.fromEntries(KANBAN_PRIORITIES.map((p) => [p.id, p])) as Record<
    KanbanPriority,
    KanbanPriorityDef
  >;

/** Generate a collision-resistant id (no external uuid dep). */
export const createTaskId = (): string =>
  `task_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

/** A blank task draft for the "add" modal. */
export const createEmptyDraft = (): Omit<Task, "id" | "createdAt" | "updatedAt"> => ({
  title: "",
  description: "",
  status: "backlog",
  priority: "medium",
  progress: { current: 0, target: 0, unit: "" },
  dueDate: "",
});

/** ISO date (yyyy-mm-dd) helper offset from today, for seed data. */
const isoOffset = (days: number): string =>
  new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

/** Seed tasks shown on first load (before any saved state exists). */
export const createSeedTasks = (): Task[] => {
  const now = Date.now();
  const stamp = (offsetMs: number) => new Date(now - offsetMs).toISOString();

  return [
    {
      id: createTaskId(),
      title: "Outreach WA ke 46 Kafe",
      description:
        "Kirim pesan WhatsApp ke daftar kafe target untuk penawaran kerja sama.",
      status: "in-progress",
      priority: "high",
      progress: { current: 10, target: 46, unit: "Kafe" },
      dueDate: isoOffset(7),
      createdAt: stamp(86400000 * 3),
      updatedAt: stamp(3600000),
    },
    {
      id: createTaskId(),
      title: "Rancang ulang halaman Portfolio",
      description: "Perbaiki layout grid, tambahkan filter kategori, dan optimalkan gambar.",
      status: "todo",
      priority: "medium",
      progress: { current: 0, target: 0, unit: "" },
      dueDate: isoOffset(14),
      createdAt: stamp(86400000 * 2),
      updatedAt: stamp(86400000),
    },
    {
      id: createTaskId(),
      title: "Setup CI/CD Vercel + Preview Deploy",
      description: "Pastikan setiap PR mendapat preview deployment otomatis.",
      status: "done",
      priority: "low",
      progress: { current: 0, target: 0, unit: "" },
      dueDate: "",
      createdAt: stamp(86400000 * 5),
      updatedAt: stamp(86400000 * 2),
    },
    {
      id: createTaskId(),
      title: "Menunggu review kontrak klien",
      description: "Klien sedang meninjau draft kontrak; follow up minggu depan.",
      status: "on-hold",
      priority: "medium",
      progress: { current: 0, target: 0, unit: "" },
      dueDate: isoOffset(3),
      createdAt: stamp(86400000 * 4),
      updatedAt: stamp(86400000),
    },
    {
      id: createTaskId(),
      title: "Riset kompetitor fitur booking",
      description: "Bandingkan 5 aplikasi booking kafe sebagai referensi fitur.",
      status: "backlog",
      priority: "low",
      progress: { current: 2, target: 5, unit: "App" },
      dueDate: "",
      createdAt: stamp(86400000),
      updatedAt: stamp(3600000 * 5),
    },
  ];
};

/** Build a fresh board state from the seed data. */
export const createSeedState = (): KanbanState => {
  const tasks = createSeedTasks();
  return {
    version: KANBAN_SCHEMA_VERSION,
    tasks,
    savedAt: Date.now(),
  };
};
