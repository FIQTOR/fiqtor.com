import { useEffect, useState } from "react";

/**
 * Reports whether the current device/viewport should be treated as
 * "low power" so decorative effects can be skipped.
 *
 * Mirrors the detection used by {@link LineWaves}: small screens, coarse
 * pointers (touch) and low-core CPUs all count as low power. Re-evaluates on
 * resize so rotating a phone or resizing into a phone layout updates live.
 */
export function useLowPower() {
  const [lowPower, setLowPower] = useState(true);

  useEffect(() => {
    const compute = () =>
      window.matchMedia("(max-width: 767px)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      (navigator.hardwareConcurrency || 8) <= 4;

    const update = () => setLowPower(compute());
    update();

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return lowPower;
}

/**
 * Reports whether the current device is a true desktop with a fine pointer
 * (mouse/trackpad) and a wide viewport. Used to gate desktop-only affordances
 * such as the custom cursor. Re-evaluates on resize so docking/resizing a
 * window updates live.
 */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const fine = window.matchMedia("(pointer: fine)");
    const coarse = window.matchMedia("(pointer: coarse)");

    const update = () => setIsDesktop(wide.matches && fine.matches && !coarse.matches);
    update();

    // React to both viewport size changes and pointer-type changes (e.g. a
    // mouse being plugged/unplugged on a hybrid device), not just resize.
    const queries = [wide, fine, coarse];
    queries.forEach((mq) => mq.addEventListener("change", update));
    window.addEventListener("resize", update);
    return () => {
      queries.forEach((mq) => mq.removeEventListener("change", update));
      window.removeEventListener("resize", update);
    };
  }, []);

  return isDesktop;
}

/**
 * Reports whether the user asked for reduced motion via the
 * `prefers-reduced-motion` media query. Decorative continuous/parallax motion
 * should be disabled when this is `true`.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();

    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
