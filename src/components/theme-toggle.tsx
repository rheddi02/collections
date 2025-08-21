"use client";

import { useTheme } from "next-themes";
import { Switch } from "~/components/ui/switch";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">
        <SunIcon size={16}/>
      </span>
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <span className="text-sm">
        <MoonIcon size={16}/>
      </span>
    </div>
  );
}
