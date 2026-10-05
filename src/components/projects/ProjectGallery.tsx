import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TbChevronLeft, TbChevronRight, TbMaximize } from "react-icons/tb";

interface ProjectGalleryProps {
  /** All screenshots to display. The first item is treated as the cover. */
  images: Array<string>;
  /** Title of the project, used for alt text / accessibility. */
  title: string;
  /** Optional className appended to the gallery wrapper. */
  className?: string;
}

/**
 * Reusable project screenshot gallery.
 *
 * Renders a large preview with previous/next navigation plus a
 * clickable thumbnail strip. Works inside the project detail modals.
 * Clicking the large preview opens a fullscreen lightbox.
 */
export default function ProjectGallery({
  images,
  title,
  className = "",
}: ProjectGalleryProps) {
  const gallery = useMemo(
    () => images.filter((src) => Boolean(src)),
    [images]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const total = gallery.length;
  const hasMultiple = total > 1;

  const goTo = (index: number) => {
    if (total === 0) return;
    setActiveIndex(((index % total) + total) % total);
  };

  const next = () => goTo(activeIndex + 1);
  const prev = () => goTo(activeIndex - 1);

  // Keyboard navigation for both the gallery and the lightbox.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, total]);

  // Reset index when the image set changes (e.g. opening another project).
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  if (total === 0) return null;

  return (
    <div className={`flex w-full flex-col gap-3 ${className}`}>
      {/* Large preview */}
      <div className="group/gallery relative w-full aspect-video overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={gallery[activeIndex]}
            src={gallery[activeIndex]}
            alt={`${title} screenshot ${activeIndex + 1}`}
            loading="lazy"
            decoding="async"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setIsLightboxOpen(true)}
            className="absolute inset-0 h-full w-full cursor-zoom-in object-contain"
          />
        </AnimatePresence>

        {/* Zoom hint */}
        <span className="pointer-events-none absolute right-3 top-3 grid place-items-center rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/gallery:opacity-100">
          <TbMaximize className="h-4 w-4" />
        </span>

        {/* Counter */}
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {activeIndex + 1} / {total}
        </span>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous screenshot"
              className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/60 group-hover/gallery:opacity-100"
            >
              <TbChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next screenshot"
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/60 group-hover/gallery:opacity-100"
            >
              <TbChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {hasMultiple && (
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {gallery.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show screenshot ${index + 1}`}
              aria-current={index === activeIndex}
              className={`relative h-14 w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition ${
                index === activeIndex
                  ? "border-blue-500 opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={src}
                alt={`${title} thumbnail ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
          >
            <motion.img
              key={gallery[activeIndex]}
              src={gallery[activeIndex]}
              alt={`${title} fullscreen ${activeIndex + 1}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            />

            <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {activeIndex + 1} / {total}
            </span>

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Previous screenshot"
                  className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <TbChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Next screenshot"
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <TbChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
