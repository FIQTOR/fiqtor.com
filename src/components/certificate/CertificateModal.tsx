import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  TbX,
  TbExternalLink,
  TbDownload,
  TbCalendar,
  TbAward,
  TbMaximize,
} from "react-icons/tb";
import { useTranslation } from "@/i18n";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import type { Certificate } from "@/components/certificate/CertificateCard";

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

/**
 * Full-screen preview for a single certificate.
 *
 * Unlike the card thumbnail (which crops into a fixed 16:10 frame), the
 * modal shows the certificate uncropped (`object-contain`) so portrait
 * documents — e.g. BNSP — stay fully readable. Clicking the image toggles
 * an even larger fullscreen zoom.
 */
export default function CertificateModal({
  certificate,
  onClose,
}: CertificateModalProps) {
  const { t } = useTranslation();
  const isOpen = Boolean(certificate);
  const [isZoomed, setIsZoomed] = useState(false);

  const trapRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);
  useBodyScrollLock(isOpen);

  const close = () => {
    setIsZoomed(false);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {certificate && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cert-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={close}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="cert-modal-panel"
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 16,
              transition: { duration: 0.18 },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-6"
          >
            <div
              ref={trapRef}
              role="dialog"
              aria-modal="true"
              aria-label={certificate.title}
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none sm:rounded-3xl dark:bg-neutral-900"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-neutral-200 p-4 sm:p-5 dark:border-neutral-800">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        certificate.thisAcademic
                          ? "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      }`}
                    >
                      <TbAward className="h-3.5 w-3.5" />
                      {certificate.thisAcademic
                        ? t("cert.badge.academic")
                        : t("cert.badge.professional")}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      <TbCalendar className="h-3.5 w-3.5" />
                      {t("cert.modal.issued")} {certificate.published}
                    </span>
                  </div>
                  <h2 className="pr-10 text-base font-bold leading-snug text-neutral-900 sm:text-lg dark:text-neutral-100">
                    {certificate.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={close}
                  aria-label={t("cert.modal.close")}
                  className="grid shrink-0 cursor-pointer place-items-center rounded-full bg-neutral-100 p-2 text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  <TbX className="h-5 w-5" />
                </button>
              </div>

              {/* Image stage */}
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-neutral-100 p-3 sm:p-6 dark:bg-neutral-950/60">
                <button
                  type="button"
                  onClick={() => setIsZoomed(true)}
                  aria-label={t("cert.modal.zoom")}
                  className="group relative flex max-h-full cursor-zoom-in items-center justify-center"
                >
                  <img
                    src={certificate.srcImage}
                    alt={certificate.title}
                    loading="lazy"
                    decoding="async"
                    className="max-h-[62vh] w-auto max-w-full rounded-lg object-contain shadow-lg sm:max-h-[68vh]"
                  />
                  <span className="pointer-events-none absolute right-3 top-3 grid place-items-center rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                    <TbMaximize className="h-4 w-4" />
                  </span>
                </button>
              </div>

              {/* Footer: tags + actions */}
              <div className="flex flex-col gap-3 border-t border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-neutral-800">
                <div className="flex flex-wrap gap-1.5">
                  {certificate.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-neutral-300/70 bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:border-neutral-700 dark:bg-white/10 dark:text-neutral-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {certificate.urlDirect && (
                    <a
                      href={certificate.urlDirect}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-neutral-300/70 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition-all hover:bg-neutral-100 dark:border-neutral-700 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                    >
                      <TbExternalLink className="h-3.5 w-3.5" />
                      <span>{t("cert.view")}</span>
                    </a>
                  )}
                  {certificate.urlPdf && (
                    <a
                      href={certificate.urlPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-blue-500"
                    >
                      <TbDownload className="h-3.5 w-3.5" />
                      <span>{t("cert.pdf")}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Fullscreen zoom */}
          <AnimatePresence>
            {isZoomed && (
              <motion.div
                key="cert-modal-zoom"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsZoomed(false)}
                className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-black/95 p-4"
              >
                <img
                  src={certificate.srcImage}
                  alt={certificate.title}
                  className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(false);
                  }}
                  aria-label={t("cert.modal.fullscreen.close")}
                  className="absolute right-4 top-4 grid cursor-pointer place-items-center rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <TbX className="h-5 w-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
