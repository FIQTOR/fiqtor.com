import {
  TbExternalLink,
  TbDownload,
  TbCalendar,
  TbAward,
} from "react-icons/tb";

export interface Certificate {
  title: string;
  published: string;
  srcImage: string;
  urlDirect?: string;
  urlPdf?: string;
  thisAcademic?: boolean;
  tags?: string[];
}

interface CertificateCardProps {
  certificate: Certificate;
  variant?: "grid" | "slider";
}

export const CertificateCard = ({ certificate, variant = "grid" }: CertificateCardProps) => {
  const isSlider = variant === "slider";

  const badge = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
        certificate.thisAcademic
          ? isSlider
            ? "border-blue-500/30 bg-blue-500/20 text-blue-300"
            : "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-300"
          : isSlider
            ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
            : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300"
      }`}
    >
      {certificate.thisAcademic ? "Academic" : "Professional"}
    </span>
  );

  const actions = (
    <div className="flex items-center gap-2">
      {certificate.urlDirect && (
        <a
          href={certificate.urlDirect}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium backdrop-blur-md transition-all hover:scale-105 ${
            isSlider
              ? "bg-white/10 text-white hover:bg-white/20"
              : "border border-neutral-300/70 bg-white text-neutral-700 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <TbExternalLink className="h-3.5 w-3.5" />
          <span>View</span>
        </a>
      )}
      {certificate.urlPdf && (
        <a
          href={certificate.urlPdf}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg bg-blue-600/80 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-blue-600 hover:scale-105"
          onClick={(e) => e.stopPropagation()}
        >
          <TbDownload className="h-3.5 w-3.5" />
          <span>PDF</span>
        </a>
      )}
    </div>
  );

  const meta = (
    <div className="flex flex-col gap-2">
      <div
        className={`flex items-center gap-1.5 text-xs ${
          isSlider ? "text-neutral-300" : "text-neutral-500 dark:text-neutral-400"
        }`}
      >
        <TbCalendar className="h-3.5 w-3.5" />
        <time className="font-medium">{certificate.published}</time>
      </div>
      <h3
        className={`text-base font-bold leading-snug line-clamp-2 sm:text-lg ${
          isSlider ? "text-white" : "text-neutral-900 dark:text-neutral-100"
        }`}
      >
        {certificate.title}
      </h3>
    </div>
  );

  const tags = certificate.tags?.length ? (
    <div className="flex flex-wrap gap-1.5">
      {certificate.tags.map((tag) => (
        <span
          key={tag}
          className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${
            isSlider
              ? "border-white/10 bg-white/10 text-neutral-300"
              : "border-neutral-300/70 bg-neutral-100 text-neutral-600 dark:border-neutral-700 dark:bg-white/10 dark:text-neutral-300"
          }`}
        >
          #{tag}
        </span>
      ))}
    </div>
  ) : null;

  if (isSlider) {
    return (
      <div className="group w-full max-w-full">
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-neutral-300/10 bg-neutral-900 shadow-xl dark:border-neutral-700/30">
          <div className="relative w-full overflow-hidden">
            <img
              src={certificate.srcImage}
              alt={certificate.title}
              loading="lazy"
              className="h-auto w-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-between bg-linear-to-t from-neutral-950/90 via-neutral-950/50 to-neutral-950/20 p-5 opacity-85 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <TbAward className="h-4 w-4 text-blue-400" />
                  {badge}
                </div>
                {actions}
              </div>
              <div className="mt-auto flex flex-col gap-2">
                {meta}
                {tags}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-neutral-300/60 bg-white shadow-md ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-500/15 dark:border-neutral-800 dark:bg-neutral-900 dark:ring-white/5 dark:hover:shadow-black/40">
      <div className="relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={certificate.srcImage}
          alt={certificate.title}
          loading="lazy"
          className="block h-auto w-full object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          {badge}
          {actions}
        </div>
        <div className="flex flex-col gap-2.5">
          {meta}
          {tags}
        </div>
      </div>
    </div>
  );
};
