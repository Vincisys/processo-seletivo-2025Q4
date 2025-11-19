"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function EnterpriseSwitcher() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div
      className={`flex items-center px-4 py-2 ${
        isCollapsed ? "justify-center" : "justify-between"
      }`}
    >
      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="block text-md font-semibold leading-tight text-white">
            Eyeson Asset
          </span>
          <span className="block text-sm text-gray-300 mt-1">
            Sistema de Gestão de Ativos
          </span>
        </div>
      )}
      <SidebarTrigger className="text-white hover:bg-[#52616f] hover:text-white" />
    </div>
  );
}
