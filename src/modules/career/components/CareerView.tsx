import { Careers } from "@/data/career";
import { useContext, useRef } from "react";
import { TbWorld, TbMapPin, TbCalendar } from "react-icons/tb";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { ContainerContext } from "@/context/container-context";

type Career = (typeof Careers)[number];

type VelocityEffect = {
  skewY: MotionValue<number>;
  scaleY: MotionValue<number>;
  glow: MotionValue<number>;
};

/**
 * Scroll-velocity effect for the timeline cards (skew / stretch / glow).
 *
 * This runs a `useVelocity → useSpring → useTransform` chain on every scroll
 * frame and, when it drives `skewY`/`scaleY` on each card, forces a repaint of
 * the whole (blurred, glass) card. That is the main source of jank on phones,
 * so we return three CONSTANT motion values on mobile (no per-frame work) while
 * keeping the exact same visual behaviour on desktop.
 */
const useScrollVelocityEffect = (): VelocityEffect => {
  const { isMobile } = useContext(ContainerContext);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 320,
    damping: 45,
    mass: 0.6,
  });

  const skewY = useTransform(smoothVelocity, [-2500, 0, 2500], [5, 0, -5]);
  const scaleY = useTransform(smoothVelocity, [-2500, 0, 2500], [1.06, 1, 1.06]);
  const glow = useTransform(smoothVelocity, [-2000, 0, 2000], [1, 0.3, 1]);

  // Static values → framer-motion skips the animation entirely when motion is
  // heavy/undesired (mobile) or the user prefers reduced motion.
  const staticEffect = {
    skewY: useTransform(smoothVelocity, () => 0),
    scaleY: useTransform(smoothVelocity, () => 1),
    glow: useTransform(smoothVelocity, () => 1),
  };

  return isMobile || reduceMotion ? staticEffect : { skewY, scaleY, glow };
};

const TimelineItem = ({
  career,
  index,
  velocity,
}: {
  career: Career;
  index: number;
  velocity: VelocityEffect;
}) => {
  const isEven = index % 2 === 0;
  const { isMobile } = useContext(ContainerContext);
  const dotScale = useTransform(velocity.glow, [0.3, 1], [1, 1.35]);

  // On mobile: a soft solid card instead of a live `backdrop-blur` (the blur is
  // what murders the frame rate over a long, scroll-driven list), and a plain
  // fade-in instead of animating `x` + `filter: blur()` per card.
  const cardClassName = isMobile
    ? "group block relative w-full overflow-hidden rounded-3xl p-6 border border-white/40 bg-white/80 dark:border-white/10 dark:bg-neutral-900/80 shadow-lg shadow-black/5"
    : `group block relative w-full overflow-hidden rounded-3xl p-6 border border-white/30 bg-white/20 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 shadow-lg shadow-black/5 transition-colors duration-300 hover:bg-white/30 dark:hover:bg-white/10 hover:border-white-500/30`;

  const revealInitial = isMobile
    ? { opacity: 0 }
    : { opacity: 0, x: isEven ? 60 : -60, filter: "blur(6px)" };
  const revealInView = isMobile
    ? { opacity: 1 }
    : { opacity: 1, x: 0, filter: "blur(0px)" };

  return (
    <div className="relative mb-12 md:mb-24 flex items-center justify-center w-full">
      {/* Timeline Center Dot */}
      <div className="absolute left-5 md:left-1/2 -translate-x-1/2 z-10">
        <motion.div
          style={{ scale: dotScale }}
          className="w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-neutral-900 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]"
        />
      </div>
      <div className={`flex flex-col md:flex-row w-full items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        {/* Date Side */}
        <div className={`hidden md:flex flex-1 ${isEven ? 'justify-end pr-12 text-right' : 'justify-start pl-12 text-left'}`}>
          <div className={`flex flex-col gap-1 ${isEven ? 'items-end' : 'items-start'}`}>
            <span className="text-sm font-bold text-blue-500 dark:text-blue-400 uppercase tracking-tighter">{career.priode}</span>
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <TbMapPin className="h-3 w-3" /> {career.location}
            </span>
          </div>
        </div>

        {/* Card Side */}
        <div className={`flex-1 pl-12 md:pl-0 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
          <motion.div style={isMobile ? undefined : { skewY: velocity.skewY, scaleY: velocity.scaleY }} className="will-change-transform">
            <motion.a
              href={career.website}
              target="_blank"
              rel="noopener noreferrer"
              initial={revealInitial}
              whileInView={revealInView}
              viewport={{ once: true, amount: 0.35 }}
              transition={isMobile ? { duration: 0.4 } : { type: "spring", stiffness: 140, damping: 20 }}
              whileHover={isMobile ? undefined : { y: -5 }}
              className={cardClassName}
            >
              {/* Ambient logo glow: blurred, blends into glass.
                  Skipped on mobile — `blur-3xl` on a 12rem image is a costly
                  extra layer per card with little visual payoff on small screens. */}
              {!isMobile && (
                <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 opacity-40 blur-3xl saturate-150 dark:opacity-30">
                  <img src={career.companyImage} alt="" aria-hidden loading="lazy" decoding="async" className="h-full w-full object-contain" />
                </div>
              )}

              <div className="relative z-10 flex flex-col gap-4">
                {/* Logo + Content */}
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/40 bg-white/70 p-2.5 shadow-sm transition-transform duration-500 group-hover:scale-105 dark:border-white/10 dark:bg-white/10${isMobile ? "" : " backdrop-blur-md"}`}>
                    <img
                      src={career.companyImage}
                      alt={career.companyName}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold group-hover:text-blue-500 transition-colors">{career.position}</h3>
                      {career.website && (
                        <span className="rounded-full bg-blue-500/10 p-1.5 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                          <TbWorld className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                    <span className="text-base font-semibold text-neutral-600 dark:text-neutral-300">
                      {career.companyName}
                    </span>

                    {/* Mobile Only Info */}
                    <div className="flex flex-col gap-1 md:hidden text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-2"><TbCalendar /> {career.priode}</span>
                      <span className="flex items-center gap-2"><TbMapPin /> {career.location}</span>
                    </div>
                  </div>
                </div>

                {career.description && (
                  <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {career.description}
                  </p>
                )}
              </div>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const CareerView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const velocity = useScrollVelocityEffect();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 25%"],
  });
  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const lineOpacity = useTransform(velocity.glow, [0.3, 1], [0.85, 1]);

  return (
    <div ref={containerRef} className="relative px-7 md:px-24">
      {/* Timeline Background Line */}
      <div className="absolute left-7 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2 bg-neutral-300/40 dark:bg-neutral-800/60" />

      {/* Timeline Progress Line (scroll driven) */}
      <motion.div
        style={{ scaleY: lineProgress, opacity: lineOpacity }}
        className="absolute left-7 md:left-1/2 top-0 bottom-0 w-0.5 origin-top md:-translate-x-1/2 bg-linear-to-b from-blue-500 via-blue-400 to-transparent shadow-[0_0_12px_rgba(59,130,246,0.45)]"
      />

      <div className="relative flex flex-col items-center py-10">
        {Careers.map((career, index) => (
          <TimelineItem key={index} career={career} index={index} velocity={velocity} />
        ))}
      </div>
    </div>
  );
};

export default CareerView;
