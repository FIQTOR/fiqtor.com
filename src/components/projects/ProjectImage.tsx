import { useEffect, useRef, type ImgHTMLAttributes } from "react";
import { useImageLoad } from "@/hooks/useImageLoad";

interface ProjectImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onLoad" | "onError"> {
  src: string;
  alt: string;
  /** Extra classes for the <img> itself. */
  className?: string;
  /** Extra classes for the skeleton overlay (e.g. rounded corners). */
  placeholderClassName?: string;
  /** Skeleton tone. Use "dark" over photos with dark scrims. */
  tone?: "light" | "dark";
  /** Fade the image in once decoded (default: true). */
  fade?: boolean;
}

/**
 * Project screenshot <img> wrapper with a load-aware placeholder.
 *
 * The problem: covers are `loading="lazy"`. Until the file arrives the <img>
 * renders as an empty box and the picture "pops" in — visible as a blank area
 * that suddenly fills. This component keeps a shimmer skeleton underneath and
 * cross-fades the image on top once it is fully loaded (no pop-in, no layout
 * shift), and leaves a quiet fallback behind if the URL 404s.
 */
export default function ProjectImage({
  src,
  alt,
  className = "",
  placeholderClassName = "",
  tone = "dark",
  fade = true,
  ...rest
}: ProjectImageProps) {
  const { status, onLoad, onError } = useImageLoad(src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Cached images can be `complete` before React attaches handlers — resolve
  // the state from the element itself so the skeleton never sticks.
  useEffect(() => {
    const node = imgRef.current;
    if (!node || !node.complete) return;
    if (node.naturalWidth > 0) onLoad();
    else onError();
  }, [src, onLoad, onError]);

  const skeletonTone =
    tone === "light"
      ? "bg-neutral-200/80 dark:bg-neutral-800/80"
      : "bg-neutral-800/60";

  return (
    <>
      {/* Skeleton placeholder (behind the image) */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${skeletonTone} ${placeholderClassName} transition-opacity duration-500 ${
          status === "loaded" ? "opacity-0" : "opacity-100"
        }`}
      >
        {status !== "loaded" && (
          <div className="h-full w-full animate-pulse bg-linear-to-br from-white/10 via-white/5 to-transparent" />
        )}
        {status === "error" && (
          <div className="absolute inset-0 grid place-items-center text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            {alt.slice(0, 24)}
          </div>
        )}
      </div>

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={onLoad}
        onError={onError}
        className={`${className} transition-opacity duration-500 ${
          fade && status !== "loaded" ? "opacity-0" : "opacity-100"
        }`}
        {...rest}
      />
    </>
  );
}
