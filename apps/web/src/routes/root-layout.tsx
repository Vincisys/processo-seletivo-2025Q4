import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";
import "../index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function RootLayout() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      storageKey="vite-ui-theme"
    >
      <QueryClientProvider client={queryClient}>
        <div className="grid grid-rows-[auto_1fr] h-svh">
          <Outlet />
        </div>
      </QueryClientProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}
