import { Toaster } from "@/components/ui/sonner";
import { EyesOnAssetSidebar } from "@/features/app/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-1 flex-row overflow-auto">
        <EyesOnAssetSidebar />
        <div className="flex flex-1 flex-col max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
      <Toaster richColors />
    </SidebarProvider>
  );
}
