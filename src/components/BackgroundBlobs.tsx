export const BackgroundBlobs = () => {
  return (
    <div className="fixed inset-0 h-full w-full pointer-events-none overflow-hidden">
      {/* Blob 1: Giant & Very Smooth */}
      <div className="absolute -top-[10%] -left-[10%] h-250 w-250 rounded-full bg-linear-to-tr from-blue-400/20 to-indigo-400/20 blur-[120px] animate-float-slower dark:from-blue-500/10 dark:to-indigo-500/10 transition-opacity duration-1000" />

      {/* Blob 2: Medium & Bright */}
      <div className="absolute top-[20%] left-[50%] h-100 w-100 rounded-full bg-orange-400/30 blur-[80px] animate-float-slow dark:bg-orange-500/10" />

      {/* Blob 3: Small & Intense */}
      <div className="absolute top-[60%] left-[10%] h-62.5 w-62.5 rounded-full bg-red-400/40 blur-[60px] animate-float dark:bg-red-600/15" />

      {/* Blob 4: Elliptical */}
      <div className="absolute top-[40%] right-[5vw] h-150 w-112.5 rounded-[100%] bg-linear-to-b from-purple-400/25 to-pink-400/25 blur-[100px] animate-float-slow dark:from-purple-900/20 dark:to-pink-900/20" />

      {/* Blob 5: Bottom Filler */}
      <div className="absolute -bottom-[20%] right-[20%] h-200 w-200 rounded-full bg-teal-400/20 blur-[140px] animate-float-slower dark:bg-teal-900/10" />

      {/* Overlay for vignette effect */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white/50 dark:to-black/50" />
    </div>
  );
};

