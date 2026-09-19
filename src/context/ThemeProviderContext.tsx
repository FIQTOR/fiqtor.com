import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";

export default function ThemeProviderContext({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
