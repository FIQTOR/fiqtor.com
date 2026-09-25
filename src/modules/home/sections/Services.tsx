import { Services } from "@/data/services";
import { useContext, useRef, useState, useEffect, useCallback } from "react";
import {
  TbHeartHandshake,
  TbWorld,
  TbCode,
  TbRobot,
  TbShoppingCart,
  TbExternalLink,
} from "react-icons/tb";
import Service from "../components/Service";
import { ContainerContext } from "@/context/container-context";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { COMPANY } from "@/config/Identity";

const Image = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...p} />;

const FloatingBadge = ({
  to,
  icon,
  title,
  subtitle,
  badgeRef,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badgeRef?: React.Ref<HTMLDivElement>;
}) => (
  <Link
    to={to}
    target="_blank"
    rel="noopener noreferrer"
    className="flex w-full px-4 py-3 sm:px-5 sm:py-3 rounded-2xl bg-white/70 dark:bg-[#121212]/70 backdrop-blur-md shadow-lg border border-neutral-200/50 dark:border-neutral-800/80 items-center gap-3 hover:scale-105 hover:bg-white dark:hover:bg-neutral-900 transition-all group z-30"
  >
    <div
      ref={badgeRef}
      className="p-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg group-hover:text-purple-500 dark:group-hover:text-blue-400 transition-colors"
    >
      {icon}
    </div>
    <div className="flex flex-col text-left">
      <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
        {title}
      </span>
      <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {subtitle}
      </span>
    </div>
  </Link>
);

// Koordinat sebaran presisi mengelilingi IARTY Hub (cx, cy disesuaikan dengan posisi icon masing-masing service)
const servicePositions = [
  {
    tailwind: "md:absolute md:top-[0%] md:left-[38%]",
    cx: "44.2%",
    cy: "5%",
    initX: -120,
    initY: 350,
  },
  {
    tailwind: "md:absolute md:top-[22%] md:right-[15%]",
    cx: "77%",
    cy: "28.5%",
    initX: -320,
    initY: 180,
  },
  {
    tailwind: "md:absolute md:top-[47%] md:left-[5%]",
    cx: "14%",
    cy: "52%",
    initX: 350,
    initY: -60,
  },
  {
    tailwind: "md:absolute md:bottom-[20%] md:right-[4%]",
    cx: "87.5%",
    cy: "64.5%",
    initX: -380,
    initY: -150,
  },
  {
    tailwind: "md:absolute md:bottom-[2%] md:left-[42%]",
    cx: "46.5%",
    cy: "92%",
    initX: 80,
    initY: -350,
  },
  {
    tailwind: "md:absolute md:bottom-[15%] md:left-[16%]",
    cx: "24.5%",
    cy: "80%",
    initX: 280,
    initY: -250,
  },
  {
    tailwind: "md:absolute md:top-[28%] md:left-[24%]",
    cx: "32%",
    cy: "33%",
    initX: 220,
    initY: 220,
  },
  {
    tailwind: "md:absolute md:top-[55%] md:right-[26%]",
    cx: "71%",
    cy: "60%",
    initX: -260,
    initY: -180,
  },
];

const ServicesSection = () => {
  const { isMobile } = useContext(ContainerContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [lines, setLines] = useState<
    { x1: number; y1: number; x2: number; y2: number }[]
  >([]);

  const updateLines = useCallback(() => {
    if (!containerRef.current || !hubRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const hubRect = hubRef.current.getBoundingClientRect();

    const hubX = hubRect.left + hubRect.width / 2 - containerRect.left;
    const hubY = hubRect.top + hubRect.height / 2 - containerRect.top;

    const newLines = itemRefs.current.map((itemEl) => {
      if (!itemEl) return { x1: hubX, y1: hubY, x2: hubX, y2: hubY };
      const itemRect = itemEl.getBoundingClientRect();
      const itemX = itemRect.left + itemRect.width / 2 - containerRect.left;
      const itemY = itemRect.top + itemRect.height / 2 - containerRect.top;
      return { x1: hubX, y1: hubY, x2: itemX, y2: itemY };
    });

    setLines(newLines);
  }, []);

  useEffect(() => {
    updateLines();
    window.addEventListener("resize", updateLines);
    const timer = setTimeout(updateLines, 600); // Trigger after entrance animation
    return () => {
      window.removeEventListener("resize", updateLines);
      clearTimeout(timer);
    };
  }, [updateLines]);

  return (
    <section
      id="services"
      className="relative md:sticky md:top-0 z-10 w-full overflow-hidden px-7 py-16 md:py-12 min-h-screen flex flex-col justify-center font-light md:px-16 lg:px-24 bg-white dark:bg-black"
    >
      <div className="flex flex-col items-center pb-4 md:pb-6">
        <div className="flex flex-col items-center gap-6 text-center w-full">
          {/* Judul & Deskripsi */}
          <div className="flex flex-col gap-3 relative z-10 mb-4 md:mb-6">
            <h2 className="text-5xl font-bold bg-linear-to-r from-neutral-950 via-neutral-800 to-neutral-950 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100 bg-clip-text text-transparent md:text-6xl flex flex-wrap justify-center items-center gap-2 md:gap-4">
              {`${COMPANY.name} Services`}
              <TbHeartHandshake
                strokeWidth="1.5"
                className="h-10 w-10 md:h-12 md:w-12 text-neutral-800 dark:text-neutral-300 transform transition-all duration-500 hover:scale-110 hover:rotate-6"
              />
            </h2>
            <p className="text-xl text-neutral-800 dark:text-neutral-300 md:text-2xl max-w-2xl mx-auto">
              Professional Solutions for Your Business Needs
            </p>

            {/* Tautan utama IARTY */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <a
                href={COMPANY.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-neutral-300/60 dark:border-neutral-700/60 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-blue-400"
              >
                <TbWorld className="h-4 w-4" />
                {COMPANY.url.replace(/^https?:\/\//, "")}
                <TbExternalLink className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={COMPANY.aiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-neutral-300/60 dark:border-neutral-700/60 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-blue-400"
              >
                <TbRobot className="h-4 w-4" />
                {COMPANY.aiUrl.replace(/^https?:\/\//, "")}
                <TbExternalLink className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Area Sentral */}
          <div
            ref={containerRef}
            className="relative w-full max-w-7xl flex flex-col md:block items-center justify-center md:h-[620px] lg:h-[660px] mb-4 mt-2"
          >
            {/* Logo IARTY (Tengah) */}
            <motion.div
              ref={hubRef}
              initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
              whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onAnimationComplete={updateLines}
              className="relative md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-40 mb-6 md:mb-0"
            >
              <div className="relative block group">
                <div className="absolute -inset-4 bg-linear-to-br from-purple-500/40 to-blue-500/40 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full p-1 bg-linear-to-br from-purple-500/50 via-neutral-300 to-blue-500/50 shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white border-[6px] border-white shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                    <Image
                      src={COMPANY.image}
                      alt={`${COMPANY.name} Logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Dynamic Realtime DOM-Measured Connecting Lines */}
            <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-10">
              {lines.map((line, idx) => (
                <motion.line
                  key={idx}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 + idx * 0.05, ease: "easeOut" }}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  style={{ transformOrigin: `${line.x1}px ${line.y1}px` }}
                  className="text-purple-600/70 dark:text-white/80 transition-colors duration-300"
                />
              ))}
            </svg>

            {/* 1. BAGIAN LINK BADGE */}
            <div className="flex flex-col gap-4 w-full md:contents z-30">
              <motion.div
                initial={
                  !isMobile
                    ? { x: 300, y: 300, scale: 0.2, opacity: 0 }
                    : { scale: 0, opacity: 0 }
                }
                whileInView={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                }}
                onAnimationComplete={updateLines}
                className="w-full md:w-auto md:absolute md:top-[6%] md:left-[2%] lg:left-[4%] z-30"
              >
                <motion.div
                  animate={
                    !isMobile
                      ? { y: [0, -8, 0, 8, 0], x: [0, 5, 0, -5, 0] }
                      : {}
                  }
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  onUpdate={updateLines}
                >
                  <FloatingBadge
                    to={COMPANY.url}
                    icon={<TbWorld className="w-5 h-5" />}
                    title="Visit Website"
                    subtitle={COMPANY.url.replace(/^https?:\/\//, "")}
                    badgeRef={(el) => {
                      itemRefs.current[Services.length] = el;
                    }}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                initial={
                  !isMobile
                    ? { x: -300, y: 300, scale: 0.2, opacity: 0 }
                    : { scale: 0, opacity: 0 }
                }
                whileInView={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                }}
                onAnimationComplete={updateLines}
                className="w-full md:w-auto md:absolute md:top-[10%] md:right-[2%] lg:right-[4%] z-30"
              >
                <motion.div
                  animate={
                    !isMobile
                      ? { y: [0, 10, 0, -10, 0], x: [0, -6, 0, 6, 0] }
                      : {}
                  }
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  onUpdate={updateLines}
                >
                  <FloatingBadge
                    to={COMPANY.educationUrl}
                    icon={<TbCode className="w-5 h-5" />}
                    title="Learn Coding"
                    subtitle={COMPANY.educationUrl.replace(/^https?:\/\//, "")}
                    badgeRef={(el) => {
                      itemRefs.current[Services.length + 1] = el;
                    }}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                initial={
                  !isMobile
                    ? { x: 300, y: -300, scale: 0.2, opacity: 0 }
                    : { scale: 0, opacity: 0 }
                }
                whileInView={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                }}
                onAnimationComplete={updateLines}
                className="w-full md:w-auto md:absolute md:bottom-[12%] md:left-[2%] lg:left-[4%] z-30"
              >
                <motion.div
                  animate={
                    !isMobile
                      ? { y: [0, -12, 0, 12, 0], x: [0, 8, 0, -8, 0] }
                      : {}
                  }
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  onUpdate={updateLines}
                >
                  <FloatingBadge
                    to={COMPANY.aiUrl}
                    icon={<TbRobot className="w-5 h-5" />}
                    title="AI for Business"
                    subtitle={COMPANY.aiUrl.replace(/^https?:\/\//, "")}
                    badgeRef={(el) => {
                      itemRefs.current[Services.length + 2] = el;
                    }}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                initial={
                  !isMobile
                    ? { x: -300, y: -300, scale: 0.2, opacity: 0 }
                    : { scale: 0, opacity: 0 }
                }
                whileInView={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.4,
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                }}
                onAnimationComplete={updateLines}
                className="w-full md:w-auto md:absolute md:bottom-[6%] md:right-[3%] lg:right-[5%] z-30"
              >
                <motion.div
                  animate={
                    !isMobile
                      ? { y: [0, 9, 0, -9, 0], x: [0, -7, 0, 7, 0] }
                      : {}
                  }
                  transition={{
                    duration: 6.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                  onUpdate={updateLines}
                >
                  <FloatingBadge
                    to={COMPANY.marketplaceUrl}
                    icon={<TbShoppingCart className="w-5 h-5" />}
                    title="AI Marketplace"
                    subtitle={COMPANY.marketplaceUrl.replace(/^https?:\/\//, "")}
                    badgeRef={(el) => {
                      itemRefs.current[Services.length + 3] = el;
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* 2. BAGIAN LIST SERVICES */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-6 mt-12 md:mt-0 md:contents z-20">
              {Services.map((service, index) => {
                const pos = servicePositions[index % servicePositions.length];
                const floatDurations = [5.5, 6.8, 7.2, 6.0, 7.5, 5.8, 6.4, 7.0];
                const duration = floatDurations[index % floatDurations.length];

                return (
                  <motion.div
                    key={index}
                    initial={
                      !isMobile
                        ? { x: pos.initX, y: pos.initY, scale: 0.1, opacity: 0 }
                        : { scale: 0, opacity: 0 }
                    }
                    whileInView={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.5 + index * 0.1,
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                    }}
                    onAnimationComplete={updateLines}
                    className={`z-20 flex justify-center ${pos.tailwind}`}
                  >
                    <motion.div
                      animate={
                        !isMobile
                          ? {
                              y: [0, -10, 0, 10, 0],
                              x: [
                                0,
                                index % 2 === 0 ? 6 : -6,
                                0,
                                index % 2 === 0 ? -6 : 6,
                                0,
                              ],
                              rotate: [0, 1.5, 0, -1.5, 0],
                            }
                          : {}
                      }
                      transition={{
                        duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3,
                      }}
                      onUpdate={updateLines}
                    >
                      <Service
                        service={service}
                        variant="minimal"
                        iconRef={(el) => {
                          itemRefs.current[index] = el;
                        }}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
