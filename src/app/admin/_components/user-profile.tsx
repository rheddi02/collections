import React from "react";
import { useSession } from "next-auth/react";
import { PersonIcon, GearIcon, TableIcon } from "@radix-ui/react-icons";
import { Label } from "~/components/ui/label";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const UserProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/admin/profile");
  };

  const handleCategoriesClick = () => {
    router.push("/admin/categories");
  };

  return (
    <DropdownMenu>
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
          Go to Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleCategoriesClick}
          className="cursor-pointer flex items-center gap-2"
        >
          <TableIcon className="size-4" />
          Manage Categories
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
