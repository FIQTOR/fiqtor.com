import LineWaves from "@/components/LineWaves";
import HelmetContainer from "@/components/HelmetContainer";
import LinktreeBox from "@/modules/linktree/components/LinktreeBox";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND_NAME, COMPANY } from "@/config/Identity";

const LinktreePage = () => {
  return (
    <>
      <HelmetContainer page="linktree" />
      <AnimatePresence mode="wait">
        <div
          key="line-waves"
          className="fixed top-0 left-0 w-full h-screen z-0 inset-0 overflow-hidden"
        >
          <LineWaves
            speed={0.3}
            innerLineCount={12}
            outerLineCount={15}
            warpIntensity={1}
            rotation={-45}
            edgeFadeWidth={0}
            colorCycleSpeed={5}
            brightness={0.05}
            color1="#ffffff"
            color2="#ffffff"
            color3="#ffffff"
            enableMouseInteraction
            mouseInfluence={2}
          />
        </div>
        <div key="linktree-content">
          <motion.section
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            id="linktree"
            className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4 pt-16"
          >
            <h1 className="sr-only">{`${BRAND_NAME} - Official Social Links`}</h1>
            <LinktreeBox />
          </motion.section>

          {/* Floating Promotion Glassmorphism */}
          <motion.a
            href={COMPANY.templatesUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="fixed left-7 md:bottom-7 top-4 md:top-auto z-30 group"
          >
            <div className="relative backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-4 max-w-xs">
              {/* Glassmorphism gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-r from-neutral-500/20 via-blue-500/20 to-neutral-500/20 rounded-2xl"></div>

              {/* Content */}
              <div className="relative z-10 flex items-center space-x-3">
                <div className="shrink-0">
                  <img
                    src={COMPANY.image}
                    alt={COMPANY.name}
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-blue-600 transition-colors">
                    Diskon Website Coffee shop
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                    Mulai dari Rp300.000
                  </p>
                </div>
                <div className="shrink-0">
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-all duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute -inset-0.5 bg-linear-to-r from-neutral-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
            </div>
          </motion.a>
        </div>
      </AnimatePresence>
    </>
  );
};

export default LinktreePage;
