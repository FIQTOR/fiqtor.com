import { useCallback, useEffect, useRef, useState } from "react";
import LineWaves from "@/components/LineWaves";
import HelmetContainer from "@/components/HelmetContainer";
import LinktreeBox from "@/modules/linktree/components/LinktreeBox";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { BRAND_NAME } from "@/config/Identity";
import { useTranslation } from "@/i18n";
import { useLowPower, usePrefersReducedMotion } from "@/hooks/useDeviceCapabilities";

/** Deterministic pseudo-random positions for the floating particles. */
const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const rnd = seed / 233280;
  const seed2 = (i * 4523 + 7919) % 233280;
  const rnd2 = seed2 / 233280;
  return {
    left: `${8 + rnd * 84}%`,
    top: `${10 + rnd2 * 80}%`,
    size: 2 + (i % 3),
    duration: 6 + rnd * 6,
    delay: rnd2 * 4,
  };
});

const LinktreePage = () => {
  const { t } = useTranslation();
  const lowPower = useLowPower();
  const reducedMotion = usePrefersReducedMotion();
  const effectsDisabled = lowPower || reducedMotion;

  // Cursor-following glow (desktop only).
  const glowX = useMotionValue(-500);
  const glowY = useMotionValue(-500);
  const smoothX = useSpring(glowX, { stiffness: 120, damping: 25 });
  const smoothY = useSpring(glowY, { stiffness: 120, damping: 25 });

  useEffect(() => {
    if (effectsDisabled) return;
    const onMove = (e: MouseEvent) => {
      glowX.set(e.clientX - 200);
      glowY.set(e.clientY - 200);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [effectsDisabled, glowX, glowY]);

  // Share popover state + copy-link feedback.
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Resolve the share URL on the client (needs window.location). Kept out of
  // render so SSR/no-window environments stay safe.
  const getShareUrl = useCallback(
    () => (typeof window !== "undefined" ? window.location.href : ""),
    [],
  );

  // Close the popover on outside click / Escape.
  useEffect(() => {
    if (!shareOpen) return;
    const onClick = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShareOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [shareOpen]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — no-op */
    }
  }, [getShareUrl]);

  return (
    <>
      <HelmetContainer page="linktree" />

      {/* Global cursor glow (monochrome) */}
      {!effectsDisabled && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed z-10 h-[400px] w-[400px] rounded-full"
          style={{
            x: smoothX,
            y: smoothY,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.12), transparent 60%)",
          }}
        />
      )}

      {/* Floating particles (monochrome, desktop only) */}
      {!effectsDisabled && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white/60"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              animate={{ y: [-8, -40], opacity: [0, 0.8, 0] }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <div
          key="line-waves"
          className="fixed top-0 left-0 w-full h-screen z-0 inset-0 overflow-hidden"
        >
          <LineWaves
            speed={0.3}
            innerLineCount={12}
            outerLineCount={15}
            warpIntensity={1}
            rotation={-45}
            edgeFadeWidth={0}
            colorCycleSpeed={5}
            brightness={0.05}
            color1="#ffffff"
            color2="#ffffff"
            color3="#ffffff"
            enableMouseInteraction
            mouseInfluence={2}
          />
        </div>
        <div key="linktree-content">
          <motion.section
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            id="linktree"
            className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4 pt-16"
          >
            <h1 className="sr-only">{t("linktree.aria", { brand: BRAND_NAME })}</h1>
            <LinktreeBox />
          </motion.section>

          {/* Share button + popover: top-left on mobile, bottom-left on desktop */}
          <div
            ref={shareRef}
            className="group fixed left-7 top-4 z-30 md:top-auto md:bottom-7"
          >
            <AnimatePresence>
              {shareOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  role="dialog"
                  aria-label={t("linktree.share")}
                  className="absolute left-0 bottom-full mb-3 w-56 origin-bottom-left rounded-2xl border border-white/20 bg-white/70 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/80"
                >
                  {/* QR code */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-xl bg-white p-2 shadow-sm">
                      {getShareUrl() && (
                        <QRCodeSVG
                          value={getShareUrl()}
                          size={160}
                          level="M"
                          bgColor="#ffffff"
                          fgColor="#0a0a0a"
                        />
                      )}
                    </div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {t("linktree.shareScan")}
                    </p>
                  </div>

                  {/* Copy link */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm font-semibold text-gray-900 transition hover:bg-black/10 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                  >
                    {copied ? (
                      <svg
                        className="h-4 w-4 text-emerald-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                    {copied ? t("linktree.copied") : t("linktree.copyLink")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={() => setShareOpen((v) => !v)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              aria-label={t("linktree.share")}
              aria-expanded={shareOpen}
              title={t("linktree.share")}
              className="relative flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/20"
            >
              <span className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-neutral-400 to-white opacity-0 blur transition group-hover:opacity-30" />
              <svg
                className="relative h-5 w-5 text-gray-900 dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342a3 3 0 100-2.684m0 2.684a3 3 0 11-2.684 2.684m2.684-5.368a3 3 0 11-2.684-2.684m8.684 7.368a3 3 0 100-2.684m0 2.684l-5.368 2.684m5.368-5.368l-5.368-2.684"
                />
              </svg>
              <span className="relative text-sm font-semibold text-gray-900 dark:text-white">
                {t("linktree.share")}
              </span>
            </motion.button>
          </div>

        </div>
      </AnimatePresence>
    </>
  );
};

export default LinktreePage;
