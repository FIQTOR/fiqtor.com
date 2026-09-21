import { useContext, useEffect, useRef, useState } from "react";
import type { LottiePlayer } from "lottie-web";
import { ContainerContext } from "@/context/ContainerProvider";

export const Anim: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile } = useContext(ContainerContext);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);

  // IMPORTANT: bail out BEFORE the dynamic import below. Previously the
  // `isMobile` guard lived only in the render return, so `lottie-web` (≈300 KB)
  // + the 313 KB JSON were still fetched/decoded on mobile for nothing.
  useEffect(() => {
    if (isMobile) return;

    let cancelled = false;
    const loadLottie = async (): Promise<void> => {
      const Lottie = await import("lottie-web");
      if (!cancelled) setLottie(Lottie.default);
    };
    loadLottie();

    return () => {
      cancelled = true;
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile || !lottie || !ref.current) return;

    const animation = lottie.loadAnimation({
      container: ref.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/lottie/animation.json",
    });

    // Pause when tab is hidden — the loop keeps compositing otherwise.
    const onVisibility = () => {
      if (document.hidden) animation.pause();
      else animation.play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      animation.destroy();
    };
  }, [lottie, isMobile]);

  if (isMobile) return null;

  return <div ref={ref} />;
};
