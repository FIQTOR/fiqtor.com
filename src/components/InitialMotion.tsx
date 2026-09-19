import { motion, AnimatePresence } from 'framer-motion';
import React from "react";
import type { ReactNode } from "react";
interface Props {
  children: ReactNode;
}

const InitialMotion = ({ children }: Props) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default InitialMotion;
