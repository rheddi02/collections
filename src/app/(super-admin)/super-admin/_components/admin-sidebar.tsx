"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { BarChart2Icon, LayoutDashboardIcon, LogOutIcon, UsersIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboardIcon },
  { label: "Users", href: "/super-admin/users", icon: UsersIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col gap-2 border-r bg-card p-3">
      <div className="mb-2 flex items-center gap-2 px-2 py-3">
        <BarChart2Icon className="h-5 w-5 text-primary" />
        <span className="text-sm font-semibold tracking-tight">System Admin</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              pathname.startsWith(href) && "bg-muted font-medium text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t pt-3">
        <div className="px-3 py-1 text-xs text-muted-foreground truncate">
          {session?.user?.email}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 w-full justify-start gap-2 text-xs text-muted-foreground"
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        >
          <LogOutIcon className="h-3.5 w-3.5" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
