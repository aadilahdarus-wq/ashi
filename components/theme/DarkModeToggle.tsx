"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { MoonIcon, SunIcon } from "@/components/icons";

export function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-3 transition-colors hover:bg-surface-2 hover:text-text-2"
    >
      {theme === "light" ? (
        <MoonIcon className="h-[18px] w-[18px] stroke-current" />
      ) : (
        <SunIcon className="h-[18px] w-[18px] stroke-current" />
      )}
    </button>
  );
}
