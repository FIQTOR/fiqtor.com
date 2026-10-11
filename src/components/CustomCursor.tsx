import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  useIsDesktop,
  usePrefersReducedMotion,
} from "@/hooks/useDeviceCapabilities";

/**
 * Global monochrome circle cursor.
 *
 * Layers:
 *  - A hollow **border-only ring** in a neutral gray by default — reads on both
 *    light and dark surfaces without disturbing them.
 *  - A **fill disc** that fades in only on hover, using
 *    `mix-blend-mode: difference` so whatever is behind it is inverted —
 *    a white surface turns black and a black surface turns white.
 *
 * The native OS cursor remains visible; the circle is purely additive.
 * Renders nothing on touch devices or when the user prefers reduced motion.
 */
export default function CustomCursor() {
  const isDesktop = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();
  const disabled = !isDesktop || reducedMotion;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Gentle spring for a smooth, floaty follow that trails the pointer slightly.
  const springX = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (disabled) return;

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // Enlarge over any interactive control anywhere on the page.
      setHovering(
        !!target?.closest(
          "a, button, [role='button'], input, select, textarea, label, [data-cursor-hover]",
        ),
      );
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    document.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [disabled, x, y]);

  if (disabled) return null;

  // Both layers are portaled straight to <body> and positioned `fixed` with no
  // intermediate wrapper. This is essential: any ancestor with its own
  // stacking/isolation context would make `mix-blend-mode: difference` blend
  // against that ancestor instead of the page — which is why the disc used to
  // always render pure white. As a direct fixed child of <body>, the disc
  // blends against the real page content underneath it.
  return createPortal(
    <>
      {/* Layer 1 — reverse-color fill disc (only on hover) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 rounded-full bg-white"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
          zIndex: 9998,
        }}
        animate={{
          width: hovering ? 64 : 30,
          height: hovering ? 64 : 30,
          opacity: visible && hovering ? 1 : 0,
        }}
        transition={{
          width: { type: "spring", stiffness: 300, damping: 26 },
          height: { type: "spring", stiffness: 300, damping: 26 },
          opacity: { duration: 0.18 },
        }}
      />

      {/* Layer 2 — monochrome border-only ring (always visible) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 rounded-full border-2"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: "rgba(128,128,128,0.8)",
          zIndex: 9999,
        }}
        animate={{
          width: hovering ? 64 : 30,
          height: hovering ? 64 : 30,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          width: { type: "spring", stiffness: 300, damping: 26 },
          height: { type: "spring", stiffness: 300, damping: 26 },
          opacity: { duration: 0.25 },
        }}
      />
    </>,
    document.body,
  );
}
