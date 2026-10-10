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
