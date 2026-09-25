import { motion } from 'framer-motion';

interface ServiceProps {
  service: {
    SvgIcon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  };
  variant?: "default" | "minimal";
  iconRef?: React.Ref<HTMLDivElement>;
}

const Service = ({ service, variant = "default", iconRef }: ServiceProps) => {
  // "minimal" variant floats the logo without a surrounding box background.
  if (variant === "minimal") {
    return (
      <div className="flex flex-col items-center gap-2 group cursor-default text-center select-none max-w-50 md:max-w-55">
        <div className="text-neutral-500 dark:text-neutral-400 group-hover:text-purple-500 dark:group-hover:text-blue-400 transition-all duration-300 drop-shadow-sm group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <div ref={iconRef} className="transform group-hover:scale-110 transition-transform duration-300 bg-neutral-100 dark:bg-neutral-800 p-4 rounded-full">
            <service.SvgIcon className="h-10 w-10 md:h-12 md:w-12 text-neutral-700 dark:text-neutral-300 group-hover:text-purple-500 dark:group-hover:text-blue-400 transition-colors" />
          </div>
        </div>
        <span className="text-sm md:text-base font-semibold text-neutral-700 dark:text-neutral-200 leading-tight mt-1">
          {service.title}
        </span>
        {/* Deskripsi ditambahkan di sini secara minimalis */}
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal line-clamp-2 md:line-clamp-none">
          {service.description}
        </p>
      </div>
    );
  }

  // Variant default bawaan kode aslimu (Tetap dipertahankan)
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex flex-col gap-4 rounded-xl bg-white p-6 transition-all border-t border-t-neutral-300 shadow-2xl backdrop-blur-xl duration-300 hover:scale-105 dark:border-t dark:border-neutral-800 dark:bg-neutral-900/50"
    >
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-neutral-100 p-4 dark:bg-neutral-800">
          <service.SvgIcon className="h-8 w-8 text-neutral-700 dark:text-neutral-300" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
          {service.title}
        </h3>
      </div>
      <p className="text-base text-neutral-600 dark:text-neutral-400">
        {service.description}
      </p>
    </motion.div>
  );
};

export default Service;