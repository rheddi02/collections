import React from "react";
import { useSession } from "next-auth/react";
import { PersonIcon } from "@radix-ui/react-icons";
import { Label } from "~/components/ui/label";
import { useRouter } from "next/navigation";

const UserProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className="mb-2 mr-2 flex items-center gap-2 p-2 cursor-pointer group hover:bg-slate-300 hover:text-foreground rounded-md" onClick={() => router.push("/admin/profile")}>
      <PersonIcon className="h-10 w-10 rounded-full border p-2 text-gray-500" />
      <div className="flex flex-col">
        <Label className="select-none text-lg">{session?.user?.name}</Label>
        <Label className="select-none text-xs">{session?.user?.email}</Label>
      </div>
    </div>
  );
};

export default UserProfile;
