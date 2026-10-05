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
import type { Language } from "@/i18n/translations";

type LocalizedText = Record<Language, string>;

/** localStorage key holding the persisted board. */
export const KANBAN_STORAGE_KEY = "fiqtor.kanban.v1";

/** Current persisted-schema version (see KanbanState.version). */
export const KANBAN_SCHEMA_VERSION = 1;

/** A single workflow column definition. */
export interface KanbanColumnDef {
  id: KanbanStatus;
  label: LocalizedText;
  /** Tailwind classes for the column accent (header dot + top border). */
  accentClass: string;
}

/** Columns rendered on the board, in order. */
export const KANBAN_COLUMNS: readonly KanbanColumnDef[] = [
  {
    id: "backlog",
    label: { en: "Backlog", id: "Backlog" },
    accentClass: "bg-neutral-400 dark:bg-neutral-500",
  },
  {
    id: "todo",
    label: { en: "To Do", id: "Akan Dikerjakan" },
    accentClass: "bg-sky-500",
  },
  {
    id: "in-progress",
    label: { en: "In Progress", id: "Sedang Berjalan" },
    accentClass: "bg-blue-500",
  },
  {
    id: "on-hold",
    label: { en: "On Hold / Waiting", id: "Ditahan / Menunggu" },
    accentClass: "bg-amber-500",
  },
  {
    id: "done",
    label: { en: "Done", id: "Selesai" },
    accentClass: "bg-emerald-500",
  },
] as const;

/** Priority presentation metadata. */
export interface KanbanPriorityDef {
  id: KanbanPriority;
  label: LocalizedText;
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
    label: { en: "High", id: "Tinggi" },
    badgeClass:
      "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    dotClass: "bg-red-500",
    order: 0,
  },
  {
    id: "medium",
    label: { en: "Medium", id: "Sedang" },
    badgeClass:
      "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    dotClass: "bg-yellow-500",
    order: 1,
  },
  {
    id: "low",
    label: { en: "Low", id: "Rendah" },
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
  order: 0,
});

/** ISO date (yyyy-mm-dd) helper offset from today, for sample data. */
const isoOffset = (days: number): string =>
  new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

/**
 * Optional sample tasks — ONLY loaded when the user explicitly asks for them
 * ("Load samples"). The board is empty by default so a first-time visitor
 * starts with a clean slate.
 */
export const createSampleTasks = (lang: Language = "en"): Task[] => {
  const now = Date.now();
  const stamp = (offsetMs: number) => new Date(now - offsetMs).toISOString();

  const samples: Array<{
    title: LocalizedText;
    description: LocalizedText;
    status: KanbanStatus;
    priority: KanbanPriority;
    progress: { current: number; target: number; unit: LocalizedText };
    dueOffset: number;
  }> = [
    {
      title: {
        en: "Outreach: message 46 cafés",
        id: "Penjangkauan: kirim pesan ke 46 kafe",
      },
      description: {
        en: "Send a WhatsApp message to the target café list proposing a partnership.",
        id: "Kirim pesan WhatsApp ke daftar kafe target untuk menawarkan kemitraan.",
      },
      status: "in-progress",
      priority: "high",
      progress: { current: 10, target: 46, unit: { en: "Cafés", id: "Kafe" } },
      dueOffset: 7,
    },
    {
      title: {
        en: "Redesign the Portfolio page",
        id: "Desain ulang halaman Portofolio",
      },
      description: {
        en: "Fix the grid layout, add category filters, and optimize images.",
        id: "Perbaiki tata letak grid, tambahkan filter kategori, dan optimalkan gambar.",
      },
      status: "todo",
      priority: "medium",
      progress: { current: 0, target: 0, unit: { en: "", id: "" } },
      dueOffset: 14,
    },
    {
      title: {
        en: "Set up CI/CD on Vercel + preview deploys",
        id: "Siapkan CI/CD di Vercel + deploy pratinjau",
      },
      description: {
        en: "Make sure every PR gets an automatic preview deployment.",
        id: "Pastikan setiap PR mendapat deploy pratinjau otomatis.",
      },
      status: "done",
      priority: "low",
      progress: { current: 0, target: 0, unit: { en: "", id: "" } },
      dueOffset: 0,
    },
    {
      title: {
        en: "Awaiting client contract review",
        id: "Menunggu tinjauan kontrak klien",
      },
      description: {
        en: "The client is reviewing the contract draft; follow up next week.",
        id: "Klien sedang meninjau draf kontrak; tindak lanjuti minggu depan.",
      },
      status: "on-hold",
      priority: "medium",
      progress: { current: 0, target: 0, unit: { en: "", id: "" } },
      dueOffset: 3,
    },
    {
      title: {
        en: "Research competitor booking features",
        id: "Riset fitur pemesanan kompetitor",
      },
      description: {
        en: "Compare 5 café booking apps as a feature reference.",
        id: "Bandingkan 5 aplikasi pemesanan kafe sebagai referensi fitur.",
      },
      status: "backlog",
      priority: "low",
      progress: { current: 2, target: 5, unit: { en: "Apps", id: "Aplikasi" } },
      dueOffset: 0,
    },
  ];

  const createdOffsets = [86400000 * 3, 86400000 * 2, 86400000 * 5, 86400000 * 4, 86400000];
  const updatedOffsets = [3600000, 86400000, 86400000 * 2, 86400000, 3600000 * 5];

  return samples.map((s, i) => ({
    id: createTaskId(),
    title: s.title[lang],
    description: s.description[lang],
    status: s.status,
    priority: s.priority,
    progress: { current: s.progress.current, target: s.progress.target, unit: s.progress.unit[lang] },
    dueDate: s.dueOffset ? isoOffset(s.dueOffset) : "",
    createdAt: stamp(createdOffsets[i]),
    updatedAt: stamp(updatedOffsets[i]),
  }));
};

/** Build a brand-new, EMPTY board state (the default first-run state). */
export const createEmptyState = (): KanbanState => ({
  version: KANBAN_SCHEMA_VERSION,
  tasks: [],
  savedAt: 0,
});

/** Build a board state pre-filled with the optional sample tasks. */
export const createSampleState = (lang: Language = "en"): KanbanState => ({
  version: KANBAN_SCHEMA_VERSION,
  tasks: createSampleTasks(lang),
  savedAt: Date.now(),
});
