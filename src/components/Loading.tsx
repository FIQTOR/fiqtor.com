import React from "react";

type LoadingProps = {
  classProps?: string;
};

const Loading = ({ classProps }: LoadingProps) => (
  <div
    className={`flex w-full flex-col items-center justify-center gap-2 ${classProps}`}
  >
    <span className="loader"></span>
    <span className="text-sm text-neutral-500 dark:text-neutral-400 animate-pulse delay-75">
      Please wait a moment...
    </span>
  </div>
);

export default Loading;
