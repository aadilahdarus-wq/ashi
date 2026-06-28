"use client";

import { usePathname } from "next/navigation";
import { DarkModeToggle } from "@/components/theme/DarkModeToggle";
import { getPageTitle } from "@/lib/navigation";

export function Topbar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-[60px] shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      <h1 className="text-[15px] font-semibold text-text">{title}</h1>
      <DarkModeToggle />
    </header>
  );
}
