
import { useState, useMemo } from "react";
import HelmetContainer from "@/components/HelmetContainer";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";
import { Certificates } from "@/data/certificate";
import CertificatesGrid from "@/modules/certification/components/CertificatesGrid";
import { TbAward, TbSearch, TbFilter, TbSchool, TbBriefcase, TbStar, TbClock } from "react-icons/tb";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n";

type CertTab = "all" | "best" | "recent" | "professional" | "academic";

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
  const month = MONTHS[monthKey] ?? 0;
  return year * 100 + month;
};

// Newest credentials first — reused for the "Recent" tab.
const recentCertificates = [...Certificates].sort(
  (a, b) => parsePublished(b.published) - parsePublished(a.published),
);

const CertificatesPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<CertTab>("all");

  const filteredCertificates = useMemo(() => {
    const base =
      activeTab === "recent"
        ? recentCertificates
        : activeTab === "best"
          ? Certificates.filter((cert) => cert.best)
          : Certificates;

    return base.filter((cert) => {
      const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      if (activeTab === "academic") return matchesSearch && cert.thisAcademic;
      if (activeTab === "professional") return matchesSearch && !cert.thisAcademic;
      return matchesSearch;
    });
  }, [searchQuery, activeTab]);

  const stats = useMemo(() => ({
    total: Certificates.length,
    academic: Certificates.filter(c => c.thisAcademic).length,
    professional: Certificates.filter(c => !c.thisAcademic).length
  }), []);

  return (
    <>
      <HelmetContainer page="certification" />
      <section
        id="certificates"
        className="page-base page-x relative py-24"
      >
        <BackgroundBlobs />

        {/* Header Section */}
        <div className="relative z-10 flex flex-col items-center mb-16 pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="h-px w-12 bg-linear-to-r from-transparent to-neutral-500" />
            <TbAward strokeWidth="1.5" className="h-10 w-10 text-neutral-800 dark:text-neutral-200" />
            <div className="h-px w-12 bg-linear-to-l from-transparent to-neutral-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-center mb-6"
          >
            <span className="bg-linear-to-r from-neutral-800 via-neutral-600 to-neutral-800 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100 bg-clip-text text-transparent">
              {t("cert.title")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 text-center max-w-2xl leading-relaxed"
          >
            {t("cert.subtitle", { total: stats.total, professional: stats.professional, academic: stats.academic })}
          </motion.p>
        </div>

        {/* Filters & Search UI */}
        <div className="relative z-10 mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex p-1 gap-1 rounded-2xl bg-neutral-200/50 dark:bg-neutral-800/50 backdrop-blur-md border border-neutral-300/30 dark:border-neutral-700/30 w-fit">
            {([
              { id: "all", label: t("cert.tab.all"), icon: TbFilter },
              { id: "best", label: t("cert.tab.best"), icon: TbStar },
              { id: "recent", label: t("cert.tab.recent"), icon: TbClock },
              { id: "professional", label: t("cert.tab.professional"), icon: TbBriefcase },
              { id: "academic", label: t("cert.tab.academic"), icon: TbSchool }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === tab.id
                  ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-lg"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative group max-w-md w-full">
            <TbSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder={t("cert.search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-300/30 dark:border-neutral-800/50 focus:border-blue-500/50 outline-none transition-all"
            />
          </div>
        </div>

        {/* Dynamic Stats Row */}
        <motion.div
          layout
          className="relative z-10 mb-12 flex flex-wrap gap-2"
        >
          {[
            { label: t("cert.stat.total"), value: stats.total, color: "text-neutral-800 dark:text-neutral-200" },
            { label: t("cert.stat.professional"), value: stats.professional, color: "text-emerald-500" },
            { label: t("cert.stat.academic"), value: stats.academic, color: "text-blue-500" }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="px-4 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm flex items-center gap-2"
            >
              <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Certificates Grid */}
        <div className="relative z-10">
          <CertificatesGrid certificates={filteredCertificates} />

          {filteredCertificates.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-neutral-500"
            >
              <TbAward className="h-20 w-20 opacity-20 mb-4" />
              <p className="text-xl font-medium">{t("cert.empty")}</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveTab("all"); }}
                className="mt-4 text-blue-500 hover:underline"
              >
                {t("cert.clearFilters")}
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default CertificatesPage;
