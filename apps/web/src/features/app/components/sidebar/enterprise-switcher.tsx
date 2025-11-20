"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function EnterpriseSwitcher() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div
      className={`flex items-center px-4 pt-2 ${
        isCollapsed ? "justify-center" : "justify-between"
      }`}
    >
      {!isCollapsed && (
        <div className="flex flex-col space-y-4">
          <img src="/images/eyesonasset-logo.png" alt="Eyeson Asset" />
          <span className="block text-sm text-black font-semibold">
            Sistema de Gestão de Ativos
          </span>
        </div>
      )}
      <SidebarTrigger className="text-black hover:bg-slate-200 hover:text-black" />
    </div>
  );
}
