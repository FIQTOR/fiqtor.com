import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import gsap from "gsap";
import { TbArrowDown, TbBrandGithub, TbBrandLinkedin, TbBrandWhatsapp, TbDownload, TbMail, TbX } from "react-icons/tb";
import { ContainerContext } from "@/context/ContainerProvider";
import MetadataConfig from "@/config/Metadata";
import {
  SOCIAL_LINKS,
  BUSINESS_EMAIL,
  RESUME,
  whatsappUrl,
  mailtoUrl,
} from "@/config/Identity";
import { Link as Link } from "react-router-dom";

const StatCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 5000;
    const startTime = performance.now();

    const updateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(easeProgress * target);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(updateCount);
    }, 1000);

    return () => clearTimeout(timer);
  }, [target]);

  return (
    <div className="flex flex-col items-center px-4 py-2 ">
      <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 font-mono tracking-tight">
        {count.toLocaleString()}+
      </span>
      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {suffix}
      </span>
    </div>
  );
};

export default function Header() {
  const metadata: any = MetadataConfig;

  const { isTiny } = useContext(ContainerContext);
  const [showCVLanguage, setShowCVLanguage] = useState(false);
  const [badgePositions, setBadgePositions] = useState<
    { top: string; left: string; rotate: number; isReverse: boolean }[]
  >([]);

  useEffect(() => {
    // Generate abstract non-2:2 randomized coordinates on mount (every refresh)
    const possibleCoords = [
      { top: `${14 + Math.floor(Math.random() * 12)}%`, left: `${10 + Math.floor(Math.random() * 14)}%`, isReverse: false },
      { top: `${48 + Math.floor(Math.random() * 14)}%`, left: `${8 + Math.floor(Math.random() * 14)}%`, isReverse: false },
      { top: `${16 + Math.floor(Math.random() * 14)}%`, left: `${62 + Math.floor(Math.random() * 18)}%`, isReverse: true },
      { top: `${58 + Math.floor(Math.random() * 14)}%`, left: `${60 + Math.floor(Math.random() * 18)}%`, isReverse: true }
    ];

    // Shuffle preset positions to break fixed 2:2 layout patterns randomly
    const shuffled = [...possibleCoords].sort(() => Math.random() - 0.5);

    const generated = shuffled.map((pos) => ({
      top: pos.top,
      left: pos.left,
      isReverse: pos.isReverse,
      rotate: Math.floor(Math.random() * 50) - 25, // -25deg to +25deg initial tilt
    }));

    setBadgePositions(generated);
  }, []);

  useEffect(() => {
    const textContent = document.getElementById("textContent");

    if (!isTiny) {
      // Fix text blink on initial render
      textContent?.classList.replace("hidden", "flex");

      // Initial GSAP setup
      const initialTextState = {
        "#text": { x: 50 },
        ".word": {
          opacity: 0,
          filter: "blur(15px)",
          rotate: "-25deg",
          y: 10,
          x: 50,
        },
      };

      // Animation timeline
      const tl = gsap.timeline();

      tl.set("#text", initialTextState["#text"])
        .set(".word", initialTextState[".word"])
        .to(".word", {
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.05,
          delay: 0.2,
          duration: 1,
          rotate: "0deg",
          y: 0,
          x: 0,
        })
        .to(
          "#text",
          {
            stagger: 0.3,
            duration: 3,
            x: 0,
          },
          "<",
        );
    } else {
      // Simple reset animation for tiny screens
      gsap.to([".word", "#text"], {
        y: 0,
        x: 0,
      });
    }

    // Cleanup function
    return () => {
      gsap.killTweensOf([".word", "#text"]);
    };
  }, [isTiny]);

  return (
    <AnimatePresence>
      <header className="relative h-full min-h-screen w-full">

        <div
          id="textContent"
          className="z-10 tiny:flex hidden h-screen w-full font-bold flex-col justify-center relative overflow-hidden items-center gap-2 text-neutral-700 dark:text-neutral-300 md:h-screen md:w-full md:gap-4"
        >
          <span
            id="text"
            className="clipgsap z-10 flex tiny:text-4xl text-7xl md:text-9xl duration-200"
          >
            {Array.from("NĬHĂO!").map((char, index) => (
              <span key={index} className="word">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span
            id="text"
            className=" flex justify-center z-10 flex-wrap gap-2 uppercase tiny:text-4xl text-6xl md:text-9xl duration-300 md:gap-0"
          >
            {`I AM ${metadata.creator}`.split(" ").map((word: string, i: number) => (
              <span key={i} className="animated-text clipgsap md:mr-5">
                {Array.from(word).map((char: string, j: number) => (
                  <span key={j} className="word">
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </span>
          <div
            id="text"
            className="font-light z-10 flex flex-col items-center tiny:text-sm text-base duration-300 md:text-xl lg:text-3xl"
          >
            <div className="animated-text clipgsap flex">
              {Array.from(
                "Experienced AI x Software Engineer",
              ).map((char, index) => (
                <span key={index} className="word">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
            <div id="text" className="animated-text clipgsap flex">
              {Array.from("With 5 years of proven expertise.").map(
                (char, index) => (
                  <span key={index} className="word">
                    {char === " " ? "\u00A0" : char}
                  </span>
                ),
              )}
            </div>
          </div>
          <motion.div
            initial={isTiny ? {} : { opacity: 0, y: 50 }}
            animate={isTiny ? {} : { opacity: 1, y: 0 }}
            transition={isTiny ? {} : { duration: 1, delay: 1 }}
            className="flex w-fit gap-1 lg:gap-4 z-10 text-base font-light"
          >
            <div className="flex gap-3 sm:gap-5 flex-wrap justify-center items-center mt-1">
              <StatCounter target={100} suffix="Projects Completed" />
              <StatCounter target={100} suffix="Satisfied Clients" />
              <StatCounter target={10000} suffix="Pages Designed" />
            </div>
          </motion.div>
          <motion.div
            initial={isTiny ? {} : { opacity: 0, y: 50 }}
            animate={isTiny ? {} : { opacity: 1, y: 0 }}
            transition={isTiny ? {} : { duration: 1, delay: 1.5 }}
            className="flex w-fit gap-3 lg:gap-5 z-20 text-base font-light items-center mt-2"
          >
            <button
              onClick={() => setShowCVLanguage(!showCVLanguage)}
              className="flex gap-2 px-7 py-3 items-center justify-center rounded-full bg-blue-600/90 text-white font-medium hover:scale-105 hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all duration-300 shadow-md"
            >
              <TbDownload strokeWidth={2.2} className="w-5 h-5" />
              <span>Resume</span>
            </button>

            {/* Inline Social Icons for Mobile */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                to={SOCIAL_LINKS.linkedin}
                target="_blank"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white/70 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700"
              >
                <TbBrandLinkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </Link>
              <Link
                to={SOCIAL_LINKS.github}
                target="_blank"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white/70 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700"
              >
                <TbBrandGithub className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
              </Link>
              <Link
                to={mailtoUrl(BUSINESS_EMAIL)}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white/70 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700"
              >
                <TbMail className="w-5 h-5 text-red-500" />
              </Link>
              <Link
                to={whatsappUrl()}
                target="_blank"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white/70 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700"
              >
                <TbBrandWhatsapp className="w-5 h-5 text-emerald-500" />
              </Link>
            </div>
          </motion.div>

          {/* Desktop Floating Space Badges with Abstract Eye-Catching Text */}
          {badgePositions.length === 4 && (
            <div className="hidden md:block">
              {/* LinkedIn Floating Badge (Massive 80px Bubble & Large Text) */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: badgePositions[0].rotate - 15 }}
                animate={{ opacity: 1, scale: 1, rotate: badgePositions[0].rotate }}
                transition={{ delay: 1.2, type: "spring", stiffness: 220, damping: 14 }}
                style={{ top: badgePositions[0].top, left: badgePositions[0].left }}
                className="absolute z-50 pointer-events-auto"
              >
                <Link
                  to={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  className={`flex items-center gap-3 group cursor-pointer relative ${badgePositions[0].isReverse ? "flex-row-reverse" : ""}`}
                >
                  {/* Click Indicator Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-3 -right-2 z-50 flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600 text-[9px] font-black tracking-wider text-white shadow-[0_0_12px_rgba(37,99,235,0.8)] border border-white/40 pointer-events-none"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    CLICK ME 👈
                  </motion.div>

                  <motion.div
                    animate={{
                      y: [0, -20, 0, 20, 0],
                      x: [0, 14, 0, -14, 0],
                      rotate: [badgePositions[0].rotate, badgePositions[0].rotate + 14, badgePositions[0].rotate, badgePositions[0].rotate - 14, badgePositions[0].rotate]
                    }}
                    transition={{ duration: 5.7, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center justify-center w-20 h-20 rounded-full bg-white/80 dark:bg-neutral-800/90 backdrop-blur-md border-2 border-blue-500/50 text-blue-600 dark:text-blue-400 group-hover:scale-125 group-hover:rotate-12 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_35px_rgba(59,130,246,0.8)] transition-all duration-300 relative"
                  >
                    <TbBrandLinkedin className="w-10 h-10" />
                  </motion.div>
                  <motion.span
                    animate={{
                      y: [0, 14, 0, -14, 0],
                      x: [0, -10, 0, 10, 0],
                      rotate: [4, -8, 4, 6, 4]
                    }}
                    transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="text-base font-black tracking-widest uppercase text-blue-500 group-hover:text-blue-400 transition-colors drop-shadow-md"
                  >
                    Let's Connect
                  </motion.span>
                </Link>
              </motion.div>

              {/* GitHub Floating Badge (Tiny 36px Bubble & Minimalist Text) */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: badgePositions[1].rotate + 15 }}
                animate={{ opacity: 1, scale: 1, rotate: badgePositions[1].rotate }}
                transition={{ delay: 1.4, type: "spring", stiffness: 220, damping: 14 }}
                style={{ top: badgePositions[1].top, left: badgePositions[1].left }}
                className="absolute z-50 pointer-events-auto"
              >
                <Link
                  to={SOCIAL_LINKS.github}
                  target="_blank"
                  className={`flex items-center gap-2 group cursor-pointer ${badgePositions[1].isReverse ? "flex-row-reverse" : ""}`}
                >
                  <motion.div
                    animate={{
                      y: [0, 22, 0, -22, 0],
                      x: [0, -16, 0, 16, 0],
                      rotate: [badgePositions[1].rotate, badgePositions[1].rotate - 12, badgePositions[1].rotate, badgePositions[1].rotate + 16, badgePositions[1].rotate]
                    }}
                    transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 dark:bg-neutral-800/90 backdrop-blur-md border border-neutral-400/60 dark:border-neutral-600/60 text-neutral-800 dark:text-neutral-200 group-hover:scale-125 group-hover:-rotate-12 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-all duration-300"
                  >
                    <TbBrandGithub className="w-4 h-4" />
                  </motion.div>
                  <motion.span
                    animate={{
                      y: [0, -16, 0, 16, 0],
                      x: [0, 12, 0, -12, 0],
                      rotate: [-5, 9, -5, -9, -5]
                    }}
                    transition={{ duration: 8.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="text-[10px] font-medium tracking-normal text-neutral-500 dark:text-neutral-400 group-hover:text-white transition-colors"
                  >
                    Explore Code
                  </motion.span>
                </Link>
              </motion.div>

              {/* Email Floating Badge (Small 44px Bubble & Medium Text) */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: badgePositions[2].rotate - 20 }}
                animate={{ opacity: 1, scale: 1, rotate: badgePositions[2].rotate }}
                transition={{ delay: 1.6, type: "spring", stiffness: 220, damping: 14 }}
                style={{ top: badgePositions[2].top, left: badgePositions[2].left }}
                className="absolute z-50 pointer-events-auto"
              >
                <Link
                  to={mailtoUrl(BUSINESS_EMAIL)}
                  className={`flex items-center gap-3 group cursor-pointer ${badgePositions[2].isReverse ? "flex-row-reverse" : ""}`}
                >
                  <motion.div
                    animate={{
                      y: [0, -24, 0, 24, 0],
                      x: [0, -14, 0, 14, 0],
                      rotate: [badgePositions[2].rotate, badgePositions[2].rotate + 18, badgePositions[2].rotate, badgePositions[2].rotate - 14, badgePositions[2].rotate]
                    }}
                    transition={{ duration: 8.2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-white/80 dark:bg-neutral-800/90 backdrop-blur-md border border-red-500/40 text-red-500 group-hover:scale-125 group-hover:rotate-12 group-hover:bg-red-500 group-hover:text-white group-hover:shadow-[0_0_25px_rgba(239,68,68,0.7)] transition-all duration-300"
                  >
                    <TbMail className="w-5 h-5" />
                  </motion.div>
                  <motion.span
                    animate={{
                      y: [0, 18, 0, -18, 0],
                      x: [0, 14, 0, -14, 0],
                      rotate: [-2, 10, -2, -14, -2]
                    }}
                    transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                    className="text-xs font-semibold tracking-wider uppercase text-red-500/90 group-hover:text-red-500 transition-colors drop-shadow-xs"
                  >
                    Send Inquiry
                  </motion.span>
                </Link>
              </motion.div>

              {/* WhatsApp Floating Badge (Large 64px Bubble & Bold Text) */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: badgePositions[3].rotate + 25 }}
                animate={{ opacity: 1, scale: 1, rotate: badgePositions[3].rotate }}
                transition={{ delay: 1.8, type: "spring", stiffness: 220, damping: 14 }}
                style={{ top: badgePositions[3].top, left: badgePositions[3].left }}
                className="absolute z-50 pointer-events-auto"
              >
                <Link
                  to={whatsappUrl()}
                  target="_blank"
                  className={`flex items-center gap-3 group cursor-pointer ${badgePositions[3].isReverse ? "flex-row-reverse" : ""}`}
                >
                  <motion.div
                    animate={{
                      y: [0, 20, 0, -20, 0],
                      x: [0, 16, 0, -16, 0],
                      rotate: [badgePositions[3].rotate, badgePositions[3].rotate - 18, badgePositions[3].rotate, badgePositions[3].rotate + 12, badgePositions[3].rotate]
                    }}
                    transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-white/80 dark:bg-neutral-800/90 backdrop-blur-md border border-emerald-500/50 text-emerald-500 group-hover:scale-125 group-hover:-rotate-12 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] transition-all duration-300"
                  >
                    <TbBrandWhatsapp className="w-8 h-8" />
                  </motion.div>
                  <motion.span
                    animate={{
                      y: [0, -16, 0, 16, 0],
                      x: [0, -12, 0, 12, 0],
                      rotate: [5, -12, 5, 10, 5]
                    }}
                    transition={{ duration: 8.6, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                    className="text-sm font-black tracking-wide text-neutral-800 dark:text-neutral-100 group-hover:text-emerald-500 transition-colors drop-shadow-xs"
                  >
                    Quick Chat
                  </motion.span>
                </Link>
              </motion.div>
            </div>
          )}
          <motion.a
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 1.5,
              y: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            href="/#subheader"
            className="absolute z-10 bottom-8 cursor-pointer flex flex-col items-center gap-3 group"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-sm font-medium tracking-wide text-neutral-600 dark:text-neutral-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
              Scroll Down
            </span>
            <div className="relative">
              <div className="absolute -inset-3 bg-blue-500/20 dark:bg-blue-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <TbArrowDown
                className="h-7 w-7 text-neutral-600 dark:text-neutral-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300 animate-bounce"
                strokeWidth={2.5}
              />
            </div>
          </motion.a>
        </div>

      </header>

      <AnimatePresence>
        {showCVLanguage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center px-4 backdrop-blur-lg"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCVLanguage(false)}
              className="absolute left-0 top-0 h-full w-full cursor-default bg-black/40 backdrop-blur-sm transition-all duration-300 hover:bg-black/50"
            />
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative flex w-full max-w-md flex-col gap-6 overflow-hidden rounded-2xl bg-white/90 p-8 shadow-2xl dark:bg-neutral-900/90 backdrop-blur-xl border border-white/20 dark:border-neutral-700/30"
            >
              <button
                className="absolute right-4 top-4 rounded-full p-2 transition-all duration-300 hover:bg-red-100 dark:hover:bg-red-900/30 group"
                onClick={() => setShowCVLanguage(false)}
              >
                <TbX className="h-5 w-5 text-red-500 transition-transform duration-300 group-hover:rotate-90" />
              </button>
              <h2 className="text-2xl font-semibold bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">Select Resume Format:</h2>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">Creative Resume</h3>
                  <div className="flex gap-4">
                    <a
                      href={RESUME.creativeEn}
                      className="group w-full rounded-xl bg-linear-to-br from-purple-500/10 to-blue-500/10 px-4 py-3 text-center text-base transition-all duration-300 hover:from-purple-500/20 hover:to-blue-500/20 hover:shadow-lg hover:shadow-purple-500/10 dark:from-purple-500/5 dark:to-blue-500/5 dark:hover:from-purple-500/10 dark:hover:to-blue-500/10 relative overflow-hidden"
                    >
                      <span className="relative z-10 font-medium text-purple-700 dark:text-purple-300 group-hover:text-purple-800 dark:group-hover:text-purple-200 transition-colors duration-300">English</span>
                      <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                    </a>
                    <a
                      href={RESUME.creativeId}
                      className="group w-full rounded-xl bg-linear-to-br from-blue-500/10 to-purple-500/10 px-4 py-3 text-center text-base transition-all duration-300 hover:from-blue-500/20 hover:to-purple-500/20 hover:shadow-lg hover:shadow-blue-500/10 dark:from-blue-500/5 dark:to-purple-500/5 dark:hover:from-blue-500/10 dark:hover:to-purple-500/10 relative overflow-hidden"
                    >
                      <span className="relative z-10 font-medium text-blue-700 dark:text-blue-300 group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors duration-300">Indonesia</span>
                      <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                    </a>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">ATS Resume</h3>
                  <div className="flex gap-4">
                    <a
                      href={RESUME.atsEn}
                      className="group w-full rounded-xl bg-linear-to-br from-emerald-500/10 to-blue-500/10 px-4 py-3 text-center text-base transition-all duration-300 hover:from-emerald-500/20 hover:to-blue-500/20 hover:shadow-lg hover:shadow-emerald-500/10 dark:from-emerald-500/5 dark:to-blue-500/5 dark:hover:from-emerald-500/10 dark:hover:to-blue-500/10 relative overflow-hidden"
                    >
                      <span className="relative z-10 font-medium text-emerald-700 dark:text-emerald-300 group-hover:text-emerald-800 dark:group-hover:text-emerald-200 transition-colors duration-300">English</span>
                      <div className="absolute inset-0 bg-linear-to-br from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                    </a>
                    <a
                      href={RESUME.atsId}
                      className="group w-full rounded-xl bg-linear-to-br from-blue-500/10 to-emerald-500/10 px-4 py-3 text-center text-base transition-all duration-300 hover:from-blue-500/20 hover:to-emerald-500/20 hover:shadow-lg hover:shadow-blue-500/10 dark:from-blue-500/5 dark:to-emerald-500/5 dark:hover:from-blue-500/10 dark:hover:to-emerald-500/10 relative overflow-hidden"
                    >
                      <span className="relative z-10 font-medium text-blue-700 dark:text-blue-300 group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors duration-300">Indonesia</span>
                      <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}