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
 * A solid white disc follows the pointer across the whole page on desktop and
 * uses `mix-blend-mode: difference`, so it renders white over dark areas and
 * black over light areas — effectively inverting whatever sits behind it.
 * When hovering an interactive control (`a`, `button`, input, …) the circle
 * grows to create a "reverse color" spotlight effect.
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

  return createPortal(
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Monochrome disc that follows the cursor with a soft trailing spring */}
      <motion.div
        className="absolute rounded-full bg-white"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
        animate={{
          width: hovering ? 64 : 26,
          height: hovering ? 64 : 26,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          width: { type: "spring", stiffness: 300, damping: 26 },
          height: { type: "spring", stiffness: 300, damping: 26 },
          opacity: { duration: 0.25 },
        }}
      />
    </div>,
    document.body,
  );
}
