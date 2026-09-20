import { motion, AnimatePresence } from "framer-motion";
import { CertificateCard } from "@/components/certificate/CertificateCard";
import type { Certificate } from "@/components/certificate/CertificateCard";

interface CertificatesGridProps {
  certificates: Certificate[];
}

export default function CertificatesGrid({ certificates }: CertificatesGridProps) {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
    >
      <AnimatePresence mode="popLayout">
        {certificates.map((certificate, index) => (
          <motion.div
            key={certificate.title}
            layout
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: Math.min(index % 8, 3) * 0.05 }}
            className="h-full"
          >
            <CertificateCard certificate={certificate} variant="grid" />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
