import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface ContextProps {
  fullPathName: string;
  setFullPathName: (titles: string) => void;
  isTiny: boolean;
  isMobile: boolean;
}

export const ContainerContext = createContext<ContextProps>({
  fullPathName: "",
  setFullPathName: () => { },
  isTiny: false,
  isMobile: false,
});

interface ContainerContextProps {
  children: ReactNode;
}

export default function ContainerProvider({ children }: ContainerContextProps) {
  const [fullPathName, setFullPathName] = useState("/");
  // Initialise from the viewport synchronously so the first render already has
  // the correct flags. Otherwise `isMobile` starts as false and LineWaves mounts
  // (creating a WebGL context) for one frame on phones before unmounting.
  const [isTiny, setIsTiny] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 350
  );
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setFullPathName(window.location.pathname + window.location.hash);
    // Function to check window width
    const checkViewportWidth = () => {
      setIsTiny(window.innerWidth < 350);
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkViewportWidth();

    // Add event listeners
    window.addEventListener("resize", checkViewportWidth);
    window.addEventListener("load", checkViewportWidth);

    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 1000); // waktu delay sebelum mulai fade (misal 1s setelah render)


    // Cleanup event listeners
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", checkViewportWidth);
      window.removeEventListener("load", checkViewportWidth);
    };
  }, []);

  return (
    <ContainerContext.Provider
      value={{ fullPathName, setFullPathName, isTiny, isMobile }}
    >
      <div
        className={`fixed overflow-hidden inset-0 bg-white dark:bg-black z-50 flex items-center justify-center transition-opacity duration-1000 ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
      >
      </div>
      <div className="font-[Ginto] bg-white dark:bg-black">{children}</div>
    </ContainerContext.Provider>
  );
}
