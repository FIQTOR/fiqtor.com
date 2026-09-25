/**
 * Pure presentation helpers for the Kanban module.
 * No React, no DOM — easy to unit test and reuse across components.
 */
import type { TaskProgress } from "@/types/kanban";

/** Clamp a number into [min, max]. */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Progress completion ratio in [0, 1]. Returns 0 when there is no target. */
export const progressRatio = (progress: TaskProgress): number => {
  if (!progress.target || progress.target <= 0) return 0;
  return clamp(progress.current / progress.target, 0, 1);
};

/** Progress percentage rounded to a whole number (0–100). */
export const progressPercent = (progress: TaskProgress): number =>
  Math.round(progressRatio(progress) * 100);

/** Does this task actually have a target to visualise? */
export const hasProgressTarget = (progress: TaskProgress): boolean =>
  Number.isFinite(progress.target) && progress.target > 0;

/**
 * "10/46 Cafés" — human counter label. Falls back gracefully when unit is empty.
 */
export const progressLabel = (progress: TaskProgress): string => {
  const base = `${progress.current}/${progress.target}`;
  return progress.unit ? `${base} ${progress.unit}` : base;
};

/** Format an ISO date (yyyy-mm-dd) into e.g. "12 Jun 2025". Empty → "". */
export const formatDate = (iso: string): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/** Days from today until `iso` (negative = overdue). Null when unset/invalid. */
export const daysUntil = (iso: string): number | null => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return Math.round((date.getTime() - today.getTime()) / 86400000);
};

/**
 * Human-friendly due-date meta: is it overdue, due soon, or later?
 * Returns null when there is no date.
 */
export const dueDateMeta = (
  iso: string
): { label: string; tone: "overdue" | "soon" | "normal" } | null => {
  const days = daysUntil(iso);
  if (days === null) return null;
  const label = formatDate(iso);
  if (days < 0) return { label, tone: "overdue" };
  if (days <= 2) return { label, tone: "soon" };
  return { label, tone: "normal" };
};

/** Download a string as a file (used by export). */
export const downloadFile = (
  filename: string,
  contents: string,
  mime = "application/json"
): void => {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

/** Build a timestamped export filename, e.g. kanban-2025-06-12.json */
export const exportFilename = (): string =>
  `kanban-${new Date().toISOString().slice(0, 10)}.json`;
