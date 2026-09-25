import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { ContainerContext } from "./container-context";

interface ContainerContextProps {
  children: ReactNode;
}

export default function ContainerProvider({ children }: ContainerContextProps) {
  // Single source of truth for the active route — derived from the router so
  // direct navigations / back / forward always reflect the real pathname.
  const { pathname } = useLocation();

  // Initialise from the viewport synchronously so the first render already has
  // the correct flags. Otherwise `isMobile` starts as false and LineWaves mounts
  // (creating a WebGL context) for one frame on phones before unmounting.
  const [isTiny, setIsTiny] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 350
  );
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const checkViewportWidth = () => {
      setIsTiny(window.innerWidth < 350);
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", checkViewportWidth);
    window.addEventListener("load", checkViewportWidth);

    return () => {
      window.removeEventListener("resize", checkViewportWidth);
      window.removeEventListener("load", checkViewportWidth);
    };
  }, []);

  const value = useMemo(
    () => ({ fullPathName: pathname, isTiny, isMobile }),
    [pathname, isTiny, isMobile]
  );

  return (
    <ContainerContext.Provider value={value}>
      <div className="font-[Ginto] bg-white dark:bg-black">{children}</div>
    </ContainerContext.Provider>
  );
}
