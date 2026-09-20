
import { useState, useMemo } from "react";
import HelmetContainer from "@/components/HelmetContainer";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";
import { Certificates } from "@/data/certificate";
import CertificatesGrid from "@/modules/certification/components/CertificatesGrid";
import { TbAward, TbSearch, TbFilter, TbSchool, TbBriefcase } from "react-icons/tb";
import { motion } from "framer-motion";

const CertificatesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "professional" | "academic">("all");

  const filteredCertificates = useMemo(() => {
    return Certificates.filter((cert) => {
      const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      if (activeTab === "all") return matchesSearch;
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
        className="relative min-h-screen px-7 py-24 font-light text-neutral-700 dark:text-neutral-300 md:px-36 overflow-hidden"
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
              Certifications
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 text-center max-w-2xl leading-relaxed"
          >
            {stats.total} verified credentials — {stats.professional} professional and{" "}
            {stats.academic} academic — each with issuer and issue date.
          </motion.p>
        </div>

        {/* Filters & Search UI */}
        <div className="relative z-10 mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex p-1 gap-1 rounded-2xl bg-neutral-200/50 dark:bg-neutral-800/50 backdrop-blur-md border border-neutral-300/30 dark:border-neutral-700/30 w-fit">
            {[
              { id: "all", label: "All", icon: TbFilter },
              { id: "professional", label: "Professional", icon: TbBriefcase },
              { id: "academic", label: "Academic", icon: TbSchool }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
              placeholder="Search by title, technology, or tag..."
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
            { label: "Total", value: stats.total, color: "text-neutral-800 dark:text-neutral-200" },
            { label: "Professional", value: stats.professional, color: "text-emerald-500" },
            { label: "Academic", value: stats.academic, color: "text-blue-500" }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="px-4 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm flex items-center gap-2"
            >
              <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{stat.label}</span>
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
              <p className="text-xl font-medium">No certificates found matching your search.</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveTab("all"); }}
                className="mt-4 text-blue-500 hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default CertificatesPage;
