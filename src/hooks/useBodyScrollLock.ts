import { useEffect } from "react";

/**
 * Locks page scroll while `active` is true (e.g. a modal is open) and
 * restores the previous `body` overflow value on close.
 *
 * @param active - whether the page should be scroll-locked
 */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}
