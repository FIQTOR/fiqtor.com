import React, { useContext } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ContainerContext } from '@/context/container-context';

interface PageTransitionProps {
  children: ReactNode;
}

// Desktop keeps the blurred slide. The `filter: blur()` transition forces a
// full-page repaint on every navigation, which is expensive on phone GPUs, so
// mobile uses an opacity + small-translate variant instead (GPU-only, no
// repaint). Same feel, far cheaper.
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
    // Fix for "fixed" positioning and blur issues:
    // Reset transform to none after the enter animation completes
    transitionEnd: {
      transform: 'none', 
      filter: 'none',
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(4px)',
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const mobilePageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    transitionEnd: { transform: 'none' },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const { isMobile } = useContext(ContainerContext);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={isMobile ? mobilePageVariants : pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full grow flex flex-col"
        style={{ transformOrigin: 'top' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
