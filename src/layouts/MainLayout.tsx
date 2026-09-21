import { Suspense, lazy } from "react";
import type { ReactNode } from "react";
import Footer from "../components/Footer";
import Navbar from "@/components/Navbar";

// AIHelper is a large component (chat UI + toolbar). Splitting it out keeps it
// from bloating the initial bundle; it renders after the shell in its own chunk.
const AIHelper = lazy(() => import("../components/AIHelper"));

interface LayoutProps {
  children: ReactNode;
  className?: string;
  [propName: string]: ReactNode | string | undefined;
}

export default function MainLayout({
  children,
  className = "",
  ...others
}: LayoutProps) {
  return (
    <>
      <div
        className={`${className} min-h-screen font-light text-neutral-700 dark:text-neutral-300`}
        {...others}
      >
        <Navbar />
        {children}
      </div>
      {import.meta.env.VITE_ENABLE_AI === 'TRUE' &&
        <Suspense fallback={null}>
          <AIHelper />
        </Suspense>}
      <Footer />
    </>
  );
}
