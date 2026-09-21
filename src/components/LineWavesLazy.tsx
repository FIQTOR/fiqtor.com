import { lazy } from "react";

/**
 * Shared lazy handle for the WebGL background. Rendering stays deferred (and
 * skipped entirely on mobile), but the chunk is warmed via `preloadLineWaves()`
 * — see ./lineWavesLoader — so it's ready before Home mounts.
 */
const LineWaves = lazy(() => import("@/components/LineWaves"));

export default LineWaves;
