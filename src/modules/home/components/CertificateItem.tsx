import { useContext } from "react";
import { motion } from "framer-motion";
import { ContainerContext } from "@/context/container-context";
import { CertificateCard } from "@/components/certificate/CertificateCard";
import type { Certificate } from "@/components/certificate/CertificateCard";

interface Props {
  certificate: Certificate;
}

export default function CertificateComponent({ certificate }: Props) {
  const { isMobile, isTiny } = useContext(ContainerContext);

  return (
    <div className="relative flex w-full max-w-full items-center justify-center text-neutral-700 dark:text-neutral-300 md:min-h-screen md:overflow-hidden py-12 md:py-0">
      {/* Timeline Line */}
      <div className="absolute left-0 hidden w-[5vw] items-center justify-end md:flex">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="absolute h-1 w-full rounded-full bg-linear-to-r from-neutral-400 to-neutral-600 dark:from-neutral-700 dark:to-neutral-800 origin-left"
        />
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="absolute h-6 w-6 rounded-full bg-linear-to-br from-neutral-500 to-neutral-700 shadow-lg shadow-neutral-500/20"
        />

      </div>

      <motion.div
        initial={{ opacity: 0, filter: "blur(15px)", y: isMobile ? 0 : 300, scale: 0.5 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
        transition={{ delay: 0.25, duration: 1 }}
        viewport={isTiny ? { once: true, amount: 0.3 } : { once: true, amount: 0 }}
        className="flex w-full max-w-full flex-col items-center"
      >
        <CertificateCard certificate={certificate} variant="slider" />
      </motion.div>
    </div>
  );
}

