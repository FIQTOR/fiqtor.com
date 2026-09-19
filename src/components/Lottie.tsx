import { useContext, useEffect, useRef, useState } from "react";
import type { LottiePlayer } from "lottie-web";
import { ContainerContext } from "@/context/ContainerProvider";

export const Anim: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile } = useContext(ContainerContext);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    const loadLottie = async (): Promise<void> => {
      const Lottie = await import("lottie-web");
      setLottie(Lottie.default);
    };
    loadLottie();
  }, []);

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/lottie/animation.json",
      });

      return () => animation.destroy();
    }
  }, [lottie]);

  if (isMobile) return null;

  return <div ref={ref} />;
};
