"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/icons";
import type { NavItem as NavItemType } from "@/lib/navigation";

export function NavItem({ item }: { item: NavItemType }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={[
        "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
        isActive
          ? "bg-orange-pale text-orange"
          : "text-text-2 hover:bg-surface-2 hover:text-text",
      ].join(" ")}
    >
      <NavIcon
        name={item.icon}
        className={[
          "h-[18px] w-[18px] shrink-0 stroke-current",
          isActive ? "text-orange" : "text-text-3 group-hover:text-text-2",
        ].join(" ")}
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}
