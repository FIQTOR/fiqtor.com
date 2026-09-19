import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import HelmetContainer from '@/components/HelmetContainer';

const NotFound = () => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance for digits
            gsap.from(".digit", {
                y: 160,
                rotationX: -90,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "expo.out",
            });

            // Floating animation for the whole text block
            gsap.to(".text-content", {
                y: 15,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
        <HelmetContainer page="notFound" />
        <div
            ref={containerRef}
            className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-700 overflow-hidden"
        >

            <div ref={titleRef} className="text-content z-10 flex flex-col items-center">
                {/* Main 404 Heading */}
                <h1 className="flex perspective-1000 select-none">
                    <span className="digit inline-block text-[15rem] font-black leading-none text-slate-900 dark:text-white">4</span>
                    <span className="digit inline-block text-[15rem] font-black leading-none text-blue-600 mx-[-20px]">0</span>
                    <span className="digit inline-block text-[15rem] font-black leading-none text-slate-900 dark:text-white">4</span>
                </h1>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mt-4">
                        Lost in the digital void?
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                        The page you're looking for doesn't exist.
                        Try playing with the bubbles while you're here.
                    </p>

                    <div className="mt-12 flex gap-6 justify-center">
                        {/* Magnetic Button Simulation */}
                        <motion.a
                            href="/"
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative px-10 py-4 bg-blue-600 rounded-full font-bold text-white shadow-[0_20px_50px_rgba(37,_99,_235,_0.3)] hover:shadow-blue-500/50 transition-all"
                        >
                            Back to Earth
                        </motion.a>

                        <Link to='/talk'>
                            <motion.button
                                whileHover={{ y: -5 }}
                                className="px-10 py-4 border-2 border-slate-200 dark:border-slate-800 rounded-full font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                            >
                                Report Issue
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Modern Grid Background Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent)] bg-[grid:24px_24px] bg-[image:linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)]" />
        </div>
        </>
    );
};

export default NotFound;