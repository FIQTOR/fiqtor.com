import { useEffect, useRef } from "react";

/**
 * Previously this was 5 sibling <div>s each with a huge `blur(60–140px)` filter,
 * all animating `transform` on repeat. On mobile GPUs that combination drops to
 * ~20–30 fps. Colored radial-gradients composite for a fraction of the cost and
 * look almost identical, so we keep the exact same palette/positions/float
 * motion — just cheaper to paint.
 *
 * The float animation is also paused whenever the element is off-screen or the
 * tab is hidden (see `is-paused` handling in index.css).
 */
export const BackgroundBlobs = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const setPaused = (paused: boolean) =>
      el.classList.toggle("bg-blobs-paused", paused);

    const onVisibility = () => setPaused(document.hidden);

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => setPaused(document.hidden || !entry.isIntersecting),
        { rootMargin: "100px" }
      );
      io.observe(el);
    }

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="bg-blobs fixed inset-0 h-full w-full pointer-events-none overflow-hidden"
    >
      {/* Layer 1: blue → indigo (was Blob 1) */}
      <div className="bg-blob bg-blob-1 animate-float-slower" />
      {/* Layer 2: orange (was Blob 2) */}
      <div className="bg-blob bg-blob-2 animate-float-slow" />
      {/* Layer 3: red (was Blob 3) */}
      <div className="bg-blob bg-blob-3 animate-float" />
      {/* Layer 4: purple → pink elliptical (was Blob 4) */}
      <div className="bg-blob bg-blob-4 animate-float-slow" />
      {/* Layer 5: teal bottom filler (was Blob 5) */}
      <div className="bg-blob bg-blob-5 animate-float-slower" />

      {/* Overlay for vignette effect (unchanged) */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white/50 dark:to-black/50" />
    </div>
  );
};
