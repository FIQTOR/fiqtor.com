import { createContext } from "react";

export interface ContainerContextProps {
  /** Current router pathname (owned by ContainerProvider via useLocation). */
  fullPathName: string;
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
  isTiny: false,
  isMobile: false,
});
