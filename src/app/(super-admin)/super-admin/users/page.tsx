"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { keepPreviousData } from "@tanstack/react-query";
import { Role } from "@/prisma/generated/enums";
import { useConfirmDialog } from "~/hooks";
import useAppStore from "~/store/app.store";
import { ToastTypes } from "~/utils/types";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

type UserRow = {
  id: number;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  categoryCount: number;
  linkCount: number;
};

const ROLE_OPTIONS = [
  { value: "ALL", label: "All roles" },
  { value: Role.USER, label: "User" },
  { value: Role.ADMIN, label: "Admin" },
  { value: Role.COLLABORATOR, label: "Collaborator" },
  { value: Role.GUEST, label: "Guest" },
  { value: Role.SUPER_ADMIN, label: "Super Admin" },
];

const ROLE_BADGE: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  USER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  COLLABORATOR: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  GUEST: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  SUPER_ADMIN: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export default function UsersPage() {
  const { confirm } = useConfirmDialog()!;
  const setToastType = useAppStore((s) => s.setToastType);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("ALL");

  const utils = api.useUtils();

  const { data, isLoading } = api.admin.users.list.useQuery(
    {
      page,
      perPage: 10,
      search: debouncedSearch || undefined,
      role: roleFilter !== "ALL" ? (roleFilter as Role) : undefined,
      isVerified: verifiedFilter === "ALL" ? undefined : verifiedFilter === "true",
    },
    { staleTime: 60 * 1000, refetchOnWindowFocus: false, placeholderData: keepPreviousData },
  );

  const updateRole = api.admin.users.updateRole.useMutation({
    onSuccess: async () => {
      await utils.admin.users.list.invalidate();
      setToastType({ type: ToastTypes.UPDATED });
    },
    onError: (e) => setToastType({ type: ToastTypes.ERROR, data: e.message }),
  });

  const toggleVerify = api.admin.users.toggleVerify.useMutation({
    onSuccess: async () => {
      await utils.admin.users.list.invalidate();
      setToastType({ type: ToastTypes.UPDATED });
    },
    onError: (e) => setToastType({ type: ToastTypes.ERROR, data: e.message }),
  });

  const deleteUser = api.admin.users.delete.useMutation({
    onSuccess: async () => {
      await utils.admin.users.list.invalidate();
      setToastType({ type: ToastTypes.DELETED });
    },
    onError: (e) => setToastType({ type: ToastTypes.ERROR, data: e.message }),
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    clearTimeout((handleSearch as any)._t);
    (handleSearch as any)._t = setTimeout(() => setDebouncedSearch(value), 350);
  };

  const handleDelete = (user: UserRow) => {
    confirm({
      title: "Delete User",
      description: `Delete "${user.username}"? This will permanently delete their account and all categories and links.`,
      warningText: "This cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: () => deleteUser.mutate({ id: user.id }),
    });
  };

  const rows = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="custom-scrollbar h-full overflow-auto">
      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            {data?.total ?? 0} total users
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search username or email…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-8 w-56 text-sm"
          />
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-36 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={verifiedFilter} onValueChange={(v) => { setVerifiedFilter(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-36 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All status</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">User</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Cats</th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Links</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Joined</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted-foreground">No users found</td>
                </tr>
              )}
              {rows.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_BADGE[user.role] ?? ""}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.isVerified ? "default" : "secondary"} className="text-xs">
                      {user.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{user.categoryCount}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{user.linkCount}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => toggleVerify.mutate({ id: user.id })}
                          disabled={toggleVerify.isPending}
                        >
                          {user.isVerified ? "Mark unverified" : "Mark verified"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {Object.values(Role)
                          .filter((r) => r !== user.role)
                          .map((r) => (
                            <DropdownMenuItem
                              key={r}
                              onClick={() => updateRole.mutate({ id: user.id, role: r })}
                              disabled={updateRole.isPending}
                            >
                              Set role: {r}
                            </DropdownMenuItem>
                          ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(user)}
                        >
                          Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
