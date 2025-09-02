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
    <div className="flex items-center justify-between gap-2 text-sm pb-2">
      {theme === "dark" ? (
        <div className="flex items-center justify-between gap-2">
          <MoonIcon size={16} />
          <div>Dark Mode</div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {" "}
          <SunIcon size={16} />
          Light Mode
        </div>
      )}
    
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
    
    </div>
  );
}
