import CareerView from "@/modules/career/elements/career-view";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";
import HelmetContainer from "@/components/HelmetContainer";
import { BRAND_NAME } from "@/config/Identity";

const CareerPage = () => {
    const { scrollY, scrollYProgress } = useScroll();
    const pageProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
    const heroY = useTransform(scrollY, [0, 600], [0, -120]);
    const heroOpacity = useTransform(scrollY, [0, 450], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 600], [1, 0.94]);

    return (
        <>
            <HelmetContainer page="career" />
            <motion.div
                style={{ scaleX: pageProgress }}
                className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-linear-to-r from-blue-500 to-blue-300"
            />
            <div className="relative min-h-screen font-light text-neutral-700 dark:text-neutral-300 overflow-hidden">
                <BackgroundBlobs />

                <motion.header
                    style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
                    className="relative z-10 px-7 pt-24 md:px-24 will-change-transform"
                >
                    <section className="flex flex-col items-center justify-center text-center py-12">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.05, type: "spring", stiffness: 200, damping: 15 }}
                            className="mb-5 rounded-full border border-neutral-300/40 bg-white/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-neutral-500 backdrop-blur-md dark:border-neutral-700/50 dark:bg-neutral-900/40 dark:text-neutral-400"
                        >
                            Working Experience
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
                        >
                            Career Timeline of{" "}
                            <span className="bg-linear-to-br dark:from-white from-black to-transparent bg-clip-text text-transparent">
                                {BRAND_NAME}
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="max-w-2xl text-lg md:text-xl text-neutral-500 dark:text-neutral-400"
                        >
                            Five years of engineering roles, company projects, and technical
                            responsibilities, listed year by year.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="mt-6 flex flex-col items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
                        >
                            Scroll to explore
                            <motion.span
                                animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                                className="block h-8 w-px bg-neutral-400 dark:bg-neutral-600"
                            />
                        </motion.div>
                    </section>
                </motion.header>

                <main className="relative z-10 pb-24">
                    <CareerView />
                </main>
            </div>
        </>
    )
}

export default CareerPage;
