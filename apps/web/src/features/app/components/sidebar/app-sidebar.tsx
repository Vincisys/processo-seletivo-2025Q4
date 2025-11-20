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
    <Sidebar collapsible="icon" className="border-r bg-slate-50">
      <SidebarHeader className="bg-slate-50">
        <EnterpriseSwitcher />
      </SidebarHeader>

      <SidebarContent className="bg-slate-50">
        <SidebarGroup className="space-y-6">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            Funcionalidades
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {items.map((item) => {
              const active = location.pathname.startsWith(item.url);
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className={cn(
                      "h-10 text-sm rounded-md transition-all duration-200",
                      "hover:bg-orange-50 hover:text-orange-600",
                      "data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700 data-[active=true]:font-medium"
                    )}
                  >
                    <Link to={item.url}>
                      <item.icon
                        className={cn(
                          "mr-2 size-4",
                          active ? "text-orange-600" : "text-muted-foreground"
                        )}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-white px-2 py-2">
        <hr className="border-t border-gray-100 -mt-px mb-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className={cn(
                "h-10 text-sm rounded-md",
                "text-muted-foreground hover:bg-red-50 hover:text-red-600",
                "transition-colors cursor-pointer"
              )}
            >
              <LogOut size={16} />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
