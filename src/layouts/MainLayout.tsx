import type { ReactNode } from "react";
import Footer from "../components/Footer";
import AIHelper from "../components/AIHelper";
import Navbar from "@/components/Navbar";

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
        <AIHelper />}
      <Footer />
    </>
  );
}
