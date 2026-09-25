import { createContext } from "react";

export interface ContainerContextProps {
  fullPathName: string;
  setFullPathName: (titles: string) => void;
  isTiny: boolean;
  isMobile: boolean;
}

/**
 * Shared container/viewport context. Kept in its own module (separate from the
 * provider component) so React Fast Refresh stays happy — a file that exports
 * a provider component must not also export non-component values.
 */
export const ContainerContext = createContext<ContainerContextProps>({
  fullPathName: "",
  setFullPathName: () => {},
  isTiny: false,
  isMobile: false,
});
