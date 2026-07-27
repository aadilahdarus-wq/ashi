"use client";

import { AshiLogo } from "@/components/logo/AshiLogo";
import { NavItem } from "@/components/sidebar/NavItem";
import { ClientSwitcher } from "@/components/sidebar/ClientSwitcher";
import { navSections } from "@/lib/navigation";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[232px] flex-col border-r border-border bg-surface">
      <div className="flex h-[60px] shrink-0 items-center border-b border-border px-4">
        <AshiLogo />
      </div>

      <ClientSwitcher />

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-5">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="mb-1.5 px-2.5 text-[10px] font-semibold tracking-[0.08em] text-text-4">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItem key={item.href} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange text-sm font-semibold text-white">
            D
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-text">Dila</p>
            <p className="truncate text-[11px] text-text-3">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
