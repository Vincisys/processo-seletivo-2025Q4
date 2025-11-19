"use client";

import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Users,
  Package,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { EnterpriseSwitcher } from "./enterprise-switcher";
import { useAuth } from "@/features/auth/hooks/useAuth";

const items = [
  // { title: "Painel", url: "/app/dashboard", icon: LayoutDashboard },
  { title: "Responsáveis", url: "/app/owner", icon: Users },
  { title: "Ativos", url: "/app/assets", icon: Package },
];

export function EyesOnAssetSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-[#333b42]">
        <EnterpriseSwitcher />
      </SidebarHeader>

      <SidebarContent className="bg-[#333b42] py-2">
        <SidebarGroup className="space-y-6">
          <SidebarGroupLabel className="text-md font-semibold text-white tracking-wider">
            Funcionalidades
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-2">
            {items.map((item) => {
              const active = location.pathname.startsWith(item.url);
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className={cn(
                      "h-12 text-base rounded-lg",
                      "hover:bg-[#52616f] transition-colors",
                      "data-[active=true]:bg-[#52616f] data-[active=true]:text-white"
                    )}
                  >
                    <Link to={item.url}>
                      <item.icon
                        className={cn(
                          "mr-3 size-6 transition-colors",
                          active ? "text-white" : "text-white"
                        )}
                      />
                      <span className="font-medium text-white">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-[#333b42] px-2 py-2">
        <hr className="border-t border-gray-200 -mt-px" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className={cn(
                "font-medium gap-3 h-12 rounded-lg px-4 py-2",
                "text-white hover:bg-[#52616f] hover:text-white",
                "transition-colors cursor-pointer"
              )}
            >
              <LogOut size={20} className="text-white" />
              <span className="text-white text-base">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
