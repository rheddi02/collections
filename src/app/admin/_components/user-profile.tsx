import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { PersonIcon, TableIcon, ExitIcon } from "@radix-ui/react-icons";
import { Label } from "~/components/ui/label";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import useAppStore from "~/store/app.store";

const UserProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { setConfirmDialog } = useAppStore((state) => ({
    setConfirmDialog: state.setConfirmDialog,
  }));
  const [isOpen, setIsOpen] = useState(false);

  const handleProfileClick = (): void => {
    router.push("/admin/profile");
  };

  const handleCategoriesClick = (): void => {
    router.push("/admin/categories");
  };

  const handleLogoutClick = (): void => {
    setIsOpen(false);
    setTimeout(() => {
      setConfirmDialog({
        isOpen: true,
        title: "Confirm Logout",
        description:
          "Are you sure you want to log out? You will need to sign in again to access your account.",
        confirmText: "Logout",
        cancelText: "Cancel",
        variant: "destructive",
        isLoading: false,
        onConfirm: async () => {
          await signOut({ callbackUrl: "/" });
        },
      });
    }, 0);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative mb-2 flex items-center gap-2 p-2 cursor-pointer group hover:bg-slate-300 hover:text-foreground rounded-md">
          <PersonIcon className="size-10 rounded-full border p-2 text-gray-500" />
          <div className="flex flex-col">
            <Label className="select-none text-lg">{session?.user?.name}</Label>
            <Label className="select-none text-xs">
              {session?.user?.email
                ? session.user.email.length > 25
                  ? session.user.email.slice(0, 25) + "..."
                  : session.user.email
                : "No email available"}
            </Label>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem 
          onClick={handleProfileClick}
          className="cursor-pointer flex items-center gap-2"
        >
          <PersonIcon className="size-4" />
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleCategoriesClick}
          className="cursor-pointer flex items-center gap-2"
        >
          <TableIcon className="size-4" />
          Manage Categories
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogoutClick}
          className="cursor-pointer flex items-center gap-2"
        >
          <ExitIcon className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
