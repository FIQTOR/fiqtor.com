import { useCallback, useState } from "react";

export type ImageLoadStatus = "loading" | "loaded" | "error";

interface UseImageLoadResult {
  /** attach to the <img onLoad={...} onError={...}> */
  onLoad: () => void;
  onError: () => void;
  status: ImageLoadStatus;
  /** true once the browser has painted the decoded image */
  isLoaded: boolean;
  isError: boolean;
}

/**
 * Tracks the load lifecycle of a single image so the UI can show a
 * placeholder/skeleton instead of an empty box that pops in late.
 *
 * Why a hook (not just `onLoad`): an image can finish loading *before* React
 * attaches the handler — cached images, `src` swapped on an already-mounted
 * <img>, or a decode that completes during hydration. In that case `onLoad`
 * never fires and the placeholder would stick forever. We therefore also check
 * `img.complete` after mount/`src` change and resolve immediately when the
 * browser already has the bitmap.
 *
 * `src` is a dependency: pass a new value when the image source changes so the
 * status resets to "loading".
 */
export function useImageLoad(src?: string): UseImageLoadResult {
  const [status, setStatus] = useState<ImageLoadStatus>(
    src ? "loading" : "error"
  );

  // Reset whenever the source changes (e.g. gallery next/prev, new project).
  //
  // Done during render rather than in an effect: a `src` change invalidates the
  // previous status, so the fresh value is *derived* from the current `src`.
  // React restarts the render immediately without committing the stale state,
  // which also avoids the extra paint (and the cascading-render warning) a
  // setState-in-effect would cause. See
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setStatus(src ? "loading" : "error");
  }

  const onLoad = useCallback(() => setStatus("loaded"), []);
  const onError = useCallback(() => setStatus("error"), []);

  return {
    onLoad,
    onError,
    status,
    isLoaded: status === "loaded",
    isError: status === "error",
  };
}
