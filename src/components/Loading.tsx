import React from "react";
import { useTranslation } from "@/i18n";

type LoadingProps = {
  classProps?: string;
};

const Loading = ({ classProps }: LoadingProps) => {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`flex w-full flex-col items-center justify-center gap-2 ${classProps}`}
    >
      <span className="loader" aria-hidden />
      <span className="text-sm text-neutral-500 dark:text-neutral-400 animate-pulse delay-75">
        {t("common.loading")}
      </span>
    </div>
  );
};

export default Loading;
