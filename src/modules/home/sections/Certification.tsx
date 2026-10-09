import { Link } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import { TbArrowRight, TbChevronsRight, TbStar, TbClock } from "react-icons/tb";
import { Certificates } from "@/data/certificate";
import { CertificateCard } from "@/components/certificate/CertificateCard";
import type { Certificate } from "@/components/certificate/CertificateCard";
import CertificateModal from "@/components/certificate/CertificateModal";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "@/i18n";

/** A carousel slot: either a real certificate or the "view all" marker card. */
type CarouselCard =
  | (Certificate & {
      uniqueId: string;
      isViewAll: false;
      originalIndex: number;
    })
  | { uniqueId: string; isViewAll: true; originalIndex: number };

/** Home carousel filter tabs. */
type HomeCertTab = "best" | "recent";

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/** Parses a "Mon YYYY" / "YYYY" label into a numeric timestamp (0 if unknown). */
const parsePublished = (published: string): number => {
  const parts = published.trim().split(/\s+/);
  const last = parts[parts.length - 1];
  const year = Number(last);
  if (Number.isNaN(year)) return 0;
  const monthKey = parts.length > 1 ? parts[0].slice(0, 3).toLowerCase() : "jan";
  return year * 100 + (MONTHS[monthKey] ?? 0);
};

/** Newest credentials first — used for the "Recent" tab. */
const recentCertificates = [...Certificates].sort(
  (a, b) => parsePublished(b.published) - parsePublished(a.published),
);

const buildCards = (list: Certificate[]): CarouselCard[] => {
  const featured = list.slice(0, 8);
  const certCards: CarouselCard[] = featured.map((cert, i) => ({
    ...cert,
    uniqueId: `cert-${i}`,
    isViewAll: false,
    originalIndex: i,
  }));

  return [
    ...certCards,
    {
      uniqueId: "view-all-card",
      isViewAll: true,
      originalIndex: featured.length,
    },
  ];
};

export default function Certification() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  const [activeTab, setActiveTab] = useState<HomeCertTab>("best");

  const activeList = useMemo(
    () =>
      activeTab === "best"
        ? Certificates.filter((cert) => cert.best)
        : recentCertificates,
    [activeTab],
  );

  const totalItems = Math.min(activeList.length, 8) + 1;

  const [selected, setSelected] = useState<Certificate | null>(null);

  const [cards, setCards] = useState<CarouselCard[]>(() =>
    buildCards(Certificates.filter((cert) => cert.best)),
  );

  const handleTabChange = (tab: HomeCertTab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setCards(buildCards(tab === "best" ? Certificates.filter((c) => c.best) : recentCertificates));
  };

  const handleNext = () => {
    setCards((prev) => {
      const newArr = [...prev];
      const first = newArr.shift();
      if (first) newArr.push(first);
      return newArr;
    });
  };

  const handlePrev = () => {
    setCards((prev) => {
      const newArr = [...prev];
      const last = newArr.pop();
      if (last) newArr.unshift(last);
      return newArr;
    });
  };

  const academicCount = Certificates.filter((c) => c.thisAcademic).length;
  const professionalCount = Certificates.filter((c) => !c.thisAcademic).length;

  const activeOriginalIndex = cards[0].originalIndex;

  return (
    <section
      ref={sectionRef}
      className="relative w-full font-light text-neutral-700 dark:text-neutral-300 py-16 md:py-32 overflow-hidden bg-neutral-50 dark:bg-neutral-950"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 -left-20 w-96 h-96 md:w-120 md:h-120 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 md:w-120 md:h-120 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="px-5 sm:px-7 md:px-24 relative z-10 flex flex-col xl:flex-row gap-10 xl:gap-16 items-center">
        {/* Left Side: Copywriting */}
        <div className="w-full xl:w-2/5 flex flex-col gap-6 md:gap-8 z-20 mt-4 md:mt-0">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col text-4xl md:text-6xl lg:text-[4.5rem] tracking-tighter leading-[1.05] text-neutral-900 dark:text-white"
          >
            <span className="font-extrabold">{t("home.cert.titleA")}</span>
            <span className="flex items-center gap-2 lg:gap-4 mt-2">
              <span className="font-light italic text-neutral-400 dark:text-neutral-500 text-3xl lg:text-6xl">
                &
              </span>
              <span className="font-extrabold pb-2">
                {t("home.cert.titleB")}
              </span>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed font-light border-l-2 border-blue-500/40 pl-4 md:pl-5 ml-1"
          >
            {t("home.cert.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-6 md:gap-12 py-6 border-y border-neutral-200 dark:border-neutral-800/60 mt-2"
          >
            {[
              { label: t("home.cert.totalItems"), value: Certificates.length },
              { label: t("home.cert.academic"), value: academicCount },
              { label: t("home.cert.professional"), value: professionalCount },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1 relative w-[45%] md:w-auto"
              >
                {idx !== 0 && (
                  <div className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 w-px h-8 bg-neutral-200 dark:bg-neutral-800" />
                )}
                <span className="text-3xl md:text-4xl font-light tracking-tighter text-neutral-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Best / Recent tab switcher — retargets the card stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex p-1 gap-1 rounded-2xl bg-neutral-200/90 dark:bg-neutral-800/90 md:bg-neutral-200/60 md:dark:bg-neutral-800/60 md:backdrop-blur-md border border-neutral-300/40 dark:border-neutral-700/40 w-fit"
          >
            {([
              { id: "best", label: t("cert.tab.best"), icon: TbStar },
              { id: "recent", label: t("cert.tab.recent"), icon: TbClock },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                aria-pressed={activeTab === tab.id}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white text-neutral-900 shadow-lg dark:bg-neutral-900 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* See-all CTA — jumps to the full /certification library */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-2"
          >
            <Link
              to="/certification"
              className="group inline-flex items-center gap-3 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-neutral-900/20 transition-all duration-300 hover:bg-blue-600 hover:shadow-blue-500/30 hover:shadow-xl dark:bg-white dark:text-neutral-900 dark:hover:bg-blue-500 dark:hover:text-white"
            >
              <span className="flex flex-col items-start leading-tight">
                <span>{t("home.cert.seeAll")}</span>
                <span className="text-[10px] font-medium text-neutral-400 transition-colors group-hover:text-blue-100 dark:text-neutral-500 dark:group-hover:text-blue-100">
                  {t("home.cert.seeAllHint")}
                </span>
              </span>
              <TbArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Interactive Card Stack */}
        <div className="w-full xl:w-3/5 flex flex-col items-center mt-4 xl:mt-0 z-10">
          {/* Card stack wrapper with a responsive height */}
          <div className="relative min-h-[22rem] sm:min-h-[28rem] lg:min-h-[32rem] w-full flex items-center justify-center perspective-[1000px]">
            {cards.map((card, index) => {
              const isFront = index === 0;
              const offset = index;

              const isVisible = offset < 4;
              const opacity = isVisible ? 1 - offset * 0.2 : 0;
              const scale = isVisible ? 1 - offset * 0.06 : 0.5;

              // Card Stack Offset logic:
              const xPos = isVisible ? offset * 8 : 0;
              const yPos = isVisible ? offset * 24 : 0;
              const rotateZ = isVisible
                ? offset % 2 === 0
                  ? offset * 1.5
                  : -offset * 1.5
                : 0;
              const zIndex = 50 - offset;

              return (
                <motion.div
                  key={card.uniqueId}
                  initial={false}
                  animate={{
                    opacity,
                    scale,
                    x: xPos,
                    y: yPos,
                    rotateZ,
                    zIndex,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                  }}
                  drag={isFront ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.8}
                  onDragEnd={(e, { offset: dragOffset, velocity }) => {
                    const swipeThreshold = 50;
                    if (dragOffset.x < -swipeThreshold || velocity.x < -300) {
                      handleNext();
                    } else if (
                      dragOffset.x > swipeThreshold ||
                      velocity.x > 300
                    ) {
                      handlePrev();
                    }
                  }}
                  className={`absolute w-full max-w-[92vw] sm:max-w-120 md:max-w-140 lg:max-w-160 xl:max-w-175 ${
                    isFront
                      ? "cursor-grab active:cursor-grabbing hover:-translate-y-2"
                      : "pointer-events-none"
                  } transition-transform duration-300 ease-out`}
                >
                  {card.isViewAll ? (
                    <Link
                      to="/certification"
                      className="group relative flex h-70 sm:h-87.5 lg:h-100 w-full flex-col items-center justify-center gap-4 md:gap-6 rounded-4xl md:rounded-[2.5rem] border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-white/95 dark:bg-neutral-900/95 md:bg-white/80 md:dark:bg-neutral-900/80 md:backdrop-blur-md transition-all duration-500 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 p-4"
                    >
                      <div className="relative flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-3xl md:rounded-3xl bg-neutral-100 shadow-sm transition-all duration-500 group-hover:bg-blue-600 group-hover:-rotate-12 group-hover:scale-110 dark:bg-neutral-800">
                        <TbArrowRight className="h-10 w-10 md:h-12 md:w-12 text-neutral-400 transition-all duration-500 group-hover:text-white" />
                      </div>
                      <div className="text-center px-4 md:px-6">
                        <p className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {t("home.cert.exploreAll")}
                        </p>
                        <p className="text-xs md:text-sm font-medium text-neutral-500 mt-2">
                          {t("home.cert.viewAll", {
                            count: Certificates.length,
                          })}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div className="bg-white dark:bg-neutral-900 rounded-4xl md:rounded-[2.5rem] shadow-2xl shadow-black/10 overflow-hidden border border-neutral-100 dark:border-neutral-800 pointer-events-none sm:pointer-events-auto">
                      <CertificateCard
                        certificate={card}
                        variant="slider"
                        onOpen={setSelected}
                      />
                    </div>
                  )}

                  {isFront && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-2 z-30 flex justify-center sm:bottom-3">
                      <div
                        className="flex grow-0 items-center gap-4 rounded-full border border-white/15 bg-neutral-950/90 md:bg-neutral-950/55 py-2 pl-4 pr-5 shadow-2xl shadow-black/30 md:backdrop-blur-md"
                        aria-label="Gesture: swipe the card left or right to browse, or click the arrows"
                      >
                        <span
                          className="pointer-events-auto grid cursor-pointer place-items-center rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrev();
                          }}
                        >
                          <TbChevronsRight className="h-4 w-4 origin-center rotate-180" />
                        </span>

                        <span className="flex flex-col items-center gap-1">
                          <span className="relative flex items-center overflow-hidden">
                            {/* top label + sliding drag tag */}
                            <motion.span
                              initial={false}
                              animate={{ x: [0, 30, 0] }}
                              transition={{
                                duration: 2.4,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="relative h-1.5 w-12 rounded-full bg-white/15"
                            >
                              <span className="absolute left-0.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-[0_0_14px_rgba(56,189,248,0.9)]" />
                            </motion.span>
                            <span className="sr-only">
                              {t("home.cert.swipeHint")}
                            </span>
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/90">
                            {t("home.cert.swipe")}
                          </span>
                        </span>

                        <span
                          className="pointer-events-auto grid cursor-pointer place-items-center rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                          }}
                        >
                          <TbChevronsRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Dots Pagination — purely decorative (the arrows/drag drive it). */}
            <div
              aria-hidden
              className="absolute -bottom-2 md:-bottom-4 flex gap-2 z-10"
            >
              {Array.from({ length: totalItems }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeOriginalIndex
                      ? "w-6 md:w-8 bg-blue-500"
                      : "w-2 bg-neutral-300 dark:bg-neutral-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <CertificateModal
        certificate={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
