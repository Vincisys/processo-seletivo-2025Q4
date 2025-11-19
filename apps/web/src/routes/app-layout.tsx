import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { EyesOnAssetSidebar } from "@/features/app/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-1 flex-col overflow-auto bg-red-500">
        <EyesOnAssetSidebar />
        <div className="flex flex-1 flex-col overflow-auto bg-blue-500">
          <Header />
          <Outlet />
        </div>
      </div>
      <Toaster richColors />
    </SidebarProvider>
  );
}
