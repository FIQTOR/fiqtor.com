import { useCallback, useEffect, useState } from "react";
import LineWaves from "@/components/LineWaves";
import HelmetContainer from "@/components/HelmetContainer";
import LinktreeBox from "@/modules/linktree/components/LinktreeBox";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { BRAND_NAME, COMPANY } from "@/config/Identity";
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

  // Share button with Web Share API + clipboard fallback.
  const [copied, setCopied] = useState(false);
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const shareData = { title: BRAND_NAME, url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled or clipboard blocked — no-op */
    }
  }, []);

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

          {/* Share button */}
          <motion.button
            type="button"
            onClick={handleShare}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            aria-label={t("linktree.share")}
            title={t("linktree.share")}
            className="group fixed right-7 bottom-7 z-30 flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/20"
          >
            <span className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-neutral-400 to-white opacity-0 blur transition group-hover:opacity-30" />
            {copied ? (
              <svg
                className="relative h-5 w-5 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
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
            )}
            <span className="relative text-sm font-semibold text-gray-900 dark:text-white">
              {copied ? t("linktree.copied") : t("linktree.share")}
            </span>
          </motion.button>

          {/* Floating Promotion Glassmorphism */}
          <motion.a
            href={COMPANY.templatesUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="fixed left-7 md:bottom-7 top-4 md:top-auto z-30 group"
          >
            <div className="relative backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-4 max-w-xs">
              {/* Glassmorphism gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-r from-neutral-500/20 via-blue-500/20 to-neutral-500/20 rounded-2xl"></div>

              {/* Content */}
              <div className="relative z-10 flex items-center space-x-3">
                <div className="shrink-0">
                  <img
                    src={COMPANY.image}
                    alt={COMPANY.name}
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-blue-600 transition-colors">
                    {t("linktree.discount")}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                    {t("linktree.from")}
                  </p>
                </div>
                <div className="shrink-0">
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-all duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute -inset-0.5 bg-linear-to-r from-neutral-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
            </div>
          </motion.a>
        </div>
      </AnimatePresence>
    </>
  );
};

export default LinktreePage;
