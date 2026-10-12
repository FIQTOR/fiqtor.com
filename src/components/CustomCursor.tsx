import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  useIsDesktop,
  usePrefersReducedMotion,
} from "@/hooks/useDeviceCapabilities";

/** Elements that count as "interactive" for the cursor's hover state. */
const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, select, textarea, label, [data-cursor-hover]";

/**
 * Global monochrome circle cursor.
 *
 * The whole cursor is wrapped in a single element that blends with the page via
 * `mix-blend-mode: difference`. Because it is portaled straight to <body> as a
 * direct child (no isolating ancestor, no positive `z-index` creating a nested
 * group), the white ring and white fill disc both invert whatever sits behind
 * them — a light surface turns dark and a dark surface turns light — keeping
 * the cursor strictly black & white on any background.
 *
 *  - Default state: a hollow **border-only ring** (white border → inverts to a
 *    crisp monochrome outline).
 *  - Hover state: an inner **fill disc** fades in and grows, so the area under
 *    the cursor visibly reverses color.
 *
 * The native OS cursor is hidden (via `body.cursor-custom`) while this is
 * mounted, so the ring/disc is the only pointer. A very high z-index keeps it
 * above cards, the navbar, modals and toasts.
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
  // Mirror the latest state values so the high-frequency mousemove handlers can
  // read them without re-subscribing or triggering renders on every event.
  const visibleRef = useRef(false);
  const hoveringRef = useRef(false);

  useEffect(() => {
    if (disabled) return;

    document.body.classList.add("cursor-custom");

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      // Only flip to visible once; otherwise this would set state on every
      // mousemove event.
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const next = !!target?.closest(INTERACTIVE_SELECTOR);
      // Only re-render when the hover state actually changes.
      if (next !== hoveringRef.current) {
        hoveringRef.current = next;
        setHovering(next);
      }
    };

    // When the pointer leaves the document (toward browser chrome, another
    // monitor, an iframe edge, …) or the window loses focus, hide the cursor
    // so it can't get stuck on screen.
    const hide = () => {
      visibleRef.current = false;
      hoveringRef.current = false;
      setVisible(false);
      setHovering(false);
    };
    const handleOut = (e: MouseEvent) => {
      if (!e.relatedTarget) hide();
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    window.addEventListener("mouseout", handleOut, { passive: true });
    window.addEventListener("blur", hide);
    return () => {
      document.body.classList.remove("cursor-custom");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mouseout", handleOut);
      window.removeEventListener("blur", hide);
    };
  }, [disabled, x, y]);

  if (disabled) return null;

  // A single fixed wrapper carries the blend mode so both layers share the same
  // compositing group and invert the page beneath. It is a direct child of
  // <body> with an explicit z-index so cards, navbar, modals and toasts (all
  // with their own stacking contexts) can never paint on top of it.
  return createPortal(
    <motion.div
      id="custom-cursor"
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[2147483647]"
      style={{ x: springX, y: springY, mixBlendMode: "difference" }}
    >
      {/* Layer 1 — reverse-color fill disc (fades in + grows on hover) */}
      <motion.div
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ width: 30, height: 30 }}
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

      {/* Layer 2 — monochrome border-only ring (always visible when on page) */}
      <motion.div
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
        style={{ width: 30, height: 30 }}
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
    </motion.div>,
    document.body,
  );
}
