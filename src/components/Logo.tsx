/**
 * Brand mark — the owner's own favicon, not a redraw.
 *
 * The SVG that used to live here was a hand-approximated bird/fish silhouette.
 * Measured against the real icon its dark-pixel IoU was only 0.22: it was a
 * different drawing that happened to share a pose. The owner asked for the
 * favicon to be used everywhere, so this component now renders the actual
 * artwork (a PNG rasterised from `public/img/icons/icon-512.png`, itself
 * derived from `public/favicon.ico`).
 *
 * Why a plain <img> and not an SVG:
 *   - the icon is a full-colour rounded-square badge, not a single-colour
 *     glyph, so it cannot inherit `currentColor` the way the old SVG did;
 *   - a raster badge keeps its own background and therefore stays legible on
 *     both the white and the near-black canvas without any theme-specific
 *     inversion.
 */

/** Intrinsic size of `public/img/brand-mark.png`. */
export const MARK_SRC = '/img/brand-mark.png';

export function Logo({
  size = 26,
  className,
  title,
}: {
  size?: number;
  className?: string;
  /** When given, the mark is exposed to assistive tech under this name. */
  title?: string;
}) {
  return (
    <img
      className={'logo' + (className ? ' ' + className : '')}
      src={MARK_SRC}
      width={size}
      height={size}
      alt={title ?? ''}
      aria-hidden={title ? undefined : true}
      decoding="async"
      draggable={false}
    />
  );
}

/**
 * Wordmark used by the navbar, footer, loader and the 404 page.
 *
 * `mark` is opt-in. The navbar shows the wordmark alone (an icon next to the
 * name read as a duplicate of the name at that size), the footer keeps it.
 */
export function Brand({ size = 26, mark = false }: { size?: number; mark?: boolean }) {
  return (
    <>
      {mark && <Logo size={size} className="brand-mark" />}
      <span className="brand-txt">FIQTOR</span>
    </>
  );
}
