import { useRef, useState, useEffect, useCallback, useContext } from "react";
import { TbCode, TbRocket, TbBulb, TbSchool, TbBriefcase } from "react-icons/tb";
import CryptocurrencyPrice from "../components/CryptoPrice";
import { motion } from "framer-motion";
import { ContainerContext } from "@/context/container-context";
import { BRAND_NAME, OWNER_NAME, PORTRAIT_IMAGE } from "@/config/Identity";

export default function About() {
  const { isMobile } = useContext(ContainerContext);
  const centerpieceRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const badge1Ref = useRef<HTMLDivElement>(null);
  const badge2Ref = useRef<HTMLDivElement>(null);
  const badge3Ref = useRef<HTMLDivElement>(null);

  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

  const updateLines = useCallback(() => {
    if (!centerpieceRef.current || !avatarRef.current) return;
    const containerRect = centerpieceRef.current.getBoundingClientRect();
    const avatarRect = avatarRef.current.getBoundingClientRect();

    const avatarX = avatarRect.left + avatarRect.width / 2 - containerRect.left;
    const avatarY = avatarRect.top + avatarRect.height / 2 - containerRect.top;

    const badges = [badge1Ref.current, badge2Ref.current, badge3Ref.current];
    const newLines = badges.map((badgeEl) => {
      if (!badgeEl) return { x1: avatarX, y1: avatarY, x2: avatarX, y2: avatarY };
      const badgeRect = badgeEl.getBoundingClientRect();
      const badgeX = badgeRect.left + badgeRect.width / 2 - containerRect.left;
      const badgeY = badgeRect.top + badgeRect.height / 2 - containerRect.top;
      return { x1: avatarX, y1: avatarY, x2: badgeX, y2: badgeY };
    });

    setLines(newLines);
  }, []);

  useEffect(() => {
    updateLines();
    window.addEventListener("resize", updateLines);
    const timer = setTimeout(updateLines, 600);
    return () => {
      window.removeEventListener("resize", updateLines);
      clearTimeout(timer);
    };
  }, [updateLines]);

  return (
    <section
      id="about"
      className="relative z-20 w-full px-4 py-24 md:py-32 font-light text-neutral-700 dark:text-neutral-300 sm:px-6 lg:px-8 xl:px-20 overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a] shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.5)] rounded-t-[2.5rem] border-t border-neutral-200/50 dark:border-neutral-800/80"
    >
      {/* Background Glow - Subtle Luxury Glow instead of bright colors */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-160 h-160 bg-neutral-300/10 dark:bg-neutral-700/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center gap-4 mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white tracking-tight">
            The Mind Behind <br className="hidden sm:block" />
            <span className="bg-linear-to-r from-neutral-800 via-neutral-500 to-neutral-800 dark:from-white dark:via-neutral-400 dark:to-white bg-clip-text text-transparent">
              The Code.
            </span>
          </h2>
        </motion.div>

        {/* Centerpiece: Profile Image & Floating Badges */}
        <div ref={centerpieceRef} className="relative w-full max-w-2xl flex justify-center mb-24">

          {/* SVG Connecting Lines */}
          <svg className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-10">
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
                transition={{ duration: 0.7, delay: 0.2 + idx * 0.1, ease: "easeOut" }}
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5 5"
                style={{ transformOrigin: `${line.x1}px ${line.y1}px` }}
                className="text-purple-600/70 dark:text-white/80 transition-colors duration-300"
              />
            ))}
          </svg>

          {/* Main Profile Picture with Platinum Ring */}
          <motion.div
            ref={avatarRef}
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onAnimationComplete={updateLines}
            className="relative z-20"
          >
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full p-0.75 bg-linear-to-br from-neutral-300 via-neutral-100 to-neutral-400 dark:from-neutral-700 dark:via-neutral-500 dark:to-neutral-800 shadow-2xl shadow-black/5 dark:shadow-white/5">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-neutral-900 border-4 border-white dark:border-[#0a0a0a]">
                <img
                  src={PORTRAIT_IMAGE}
                  alt={`${OWNER_NAME} Profile`}
                  width={400}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            {/* Greeting Tag */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-6 py-3 rounded-full bg-white dark:bg-[#121212] shadow-xl border border-neutral-200 dark:border-neutral-800 font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-2"
            >
              <span>Hello World</span>
              <span className="animate-bounce inline-block">🖐️</span>
            </motion.div>
          </motion.div>

          {/* Floating Badge 1 - Top Left */}
          <motion.div
            initial={{ x: 50, y: 50, opacity: 0 }}
            whileInView={{ x: 0, y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: "spring" }}
            onAnimationComplete={updateLines}
            className="hidden lg:flex absolute top-4 -left-12 z-30"
          >
            <motion.div
              animate={!isMobile ? { y: [0, -8, 0, 8, 0], x: [0, 5, 0, -5, 0] } : {}}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              onUpdate={updateLines}
              className="px-5 py-3 rounded-2xl bg-white/70 dark:bg-[#121212]/70 backdrop-blur-md shadow-lg border border-neutral-200/50 dark:border-neutral-800/80 flex items-center gap-3"
            >
              <div ref={badge1Ref} className="p-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg">
                <TbSchool className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Expertise</span>
                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Software Architecture</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Badge 2 - Top Right */}
          <motion.div
            initial={{ x: -50, y: 50, opacity: 0 }}
            whileInView={{ x: 0, y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: "spring" }}
            onAnimationComplete={updateLines}
            className="hidden lg:flex absolute top-12 -right-24 z-30"
          >
            <motion.div
              animate={!isMobile ? { y: [0, 10, 0, -10, 0], x: [0, -6, 0, 6, 0] } : {}}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              onUpdate={updateLines}
              className="px-5 py-3 rounded-2xl bg-white/70 dark:bg-[#121212]/70 backdrop-blur-md shadow-lg border border-neutral-200/50 dark:border-neutral-800/80 flex items-center gap-3"
            >
              <div ref={badge2Ref} className="p-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg">
                <TbBriefcase className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Founder</span>
                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">IARTY Group</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Badge 3 - Bottom Right */}
          <motion.div
            initial={{ x: -50, y: -50, opacity: 0 }}
            whileInView={{ x: 0, y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, type: "spring" }}
            onAnimationComplete={updateLines}
            className="hidden lg:flex absolute bottom-8 -right-12 z-30"
          >
            <motion.div
              animate={!isMobile ? { y: [0, -12, 0, 12, 0], x: [0, 8, 0, -8, 0] } : {}}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              onUpdate={updateLines}
              className="px-5 py-3 rounded-2xl bg-white/70 dark:bg-[#121212]/70 backdrop-blur-md shadow-lg border border-neutral-200/50 dark:border-neutral-800/80 flex items-center gap-3"
            >
              <div ref={badge3Ref} className="p-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg">
                <TbCode className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Exploring</span>
                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">AI Integration Specialist</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Content Bento Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Card 1: Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800/80 rounded-3xl p-8 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors shadow-sm cursor-default"
          >
            <div className="flex items-center gap-3 mb-4">
              <TbRocket className="w-6 h-6 text-neutral-800 dark:text-neutral-200" />
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Who I Am</h3>
            </div>
            <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
              Hi, I'm <span className="font-semibold text-neutral-900 dark:text-neutral-200">{OWNER_NAME}</span>, also known as <span className="font-semibold text-neutral-900 dark:text-neutral-200">{BRAND_NAME}</span>.
              I am a Software Engineering enthusiast with hands-on coding experience since 2021.
              Passionate about solving complex problems and turning abstract ideas into highly functional digital solutions.
            </p>
          </motion.div>

          {/* Card 2: Cryptocurrency Widget */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="col-span-1 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800/80 rounded-3xl p-6 flex flex-col justify-center items-center hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors shadow-sm cursor-default"
          >
            <div className="w-full h-full flex flex-col justify-center">
              <span className="text-sm font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4 text-center">Market Watch</span>
              <CryptocurrencyPrice />
            </div>
          </motion.div>

          {/* Card 3: Experience */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="col-span-1 md:col-span-1 lg:col-span-1 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800/80 rounded-3xl p-8 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors shadow-sm cursor-default"
          >
            <div className="flex items-center gap-3 mb-4">
              <TbBriefcase className="w-6 h-6 text-neutral-800 dark:text-neutral-200" />
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Experience</h3>
            </div>
            <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
              Worked on real projects during internships, helping businesses grow through digital transformation. I actively contribute to improving workflow efficiency and increasing digital sales presence.
            </p>
          </motion.div>

          {/* Card 4: Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
            className="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800/80 rounded-3xl p-8 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors shadow-sm cursor-default"
          >
            <div className="flex items-center gap-3 mb-4">
              <TbBulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Vision & Growth</h3>
            </div>
            <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
              I am incredibly excited about the power of AI to accelerate development and create smarter, self-reliant systems. This ongoing journey constantly sharpens my technical skills and strengthens my overall love for pushing the boundaries of tech.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}