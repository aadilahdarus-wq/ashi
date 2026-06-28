"use client";

import { AshiLogo } from "@/components/logo/AshiLogo";
import { ChevronDownIcon } from "@/components/icons";
import { NavItem } from "@/components/sidebar/NavItem";
import { navSections } from "@/lib/navigation";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[232px] flex-col border-r border-border bg-surface">
      <div className="flex h-[60px] shrink-0 items-center border-b border-border px-4">
        <AshiLogo />
      </div>

      <div className="border-b border-border px-3 py-3">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-surface px-2.5 py-2 text-left transition-colors hover:bg-surface-2"
        >
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-text">
              AM Interpretiv
            </span>
          </span>
          <ChevronDownIcon className="h-4 w-4 shrink-0 stroke-text-4" />
        </button>
      </div>

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
