/**
 * Eager loader for the WebGL background chunk, kept in its own (non-component)
 * module so `react-refresh` stays happy. The home page only mounts after the
 * welcome screen, so a plain `lazy()` would begin downloading LineWaves' chunk
 * *after* the hero animation starts and pop in late. Calling `preloadLineWaves()`
 * during the welcome screen makes the chunk ready by the time Home renders.
 */
let preloadPromise: Promise<unknown> | null = null;

export function preloadLineWaves(): Promise<unknown> {
  if (!preloadPromise) preloadPromise = import("@/components/LineWaves");
  return preloadPromise;
}
