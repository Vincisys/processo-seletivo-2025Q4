import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";
import "../index.css";

export function RootLayout() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      storageKey="vite-ui-theme"
    >
      <div className="grid grid-rows-[auto_1fr] h-svh">
        <Outlet />
      </div>
      <Toaster richColors />
    </ThemeProvider>
  );
}
