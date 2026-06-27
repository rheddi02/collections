"use client";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import useAppStore from "~/store/app.store";
import { type NavigationType } from "~/utils/types";
import { useNavigationLists } from "~/hooks/useNavigationLists";
import { Fragment, useEffect, useRef, useState } from "react";
import UserProfile from "./user-profile";
import { isMobile } from "react-device-detect";
import { useQueryClient } from "@tanstack/react-query";
import { ThemeToggle } from "~/components/theme-toggle";
import { api } from "~/trpc/react";
import { useApiUtils } from "~/hooks/useApiUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { DrawingPinFilledIcon, DrawingPinIcon } from "@radix-ui/react-icons";
import { useConfirmDialog } from "~/hooks";

export default function Navigation() {
  const navLists = useNavigationLists();
  const { openMenu, setOpenMenu } = useAppStore((state) => ({
    openMenu: state.openMenu,
    setOpenMenu: state.setOpenMenu,
  }));

  useEffect(() => {
    setOpenMenu(!isMobile);
  }, [isMobile]);

  return (
    <nav className={cn(openMenu ? "w-72" : "hidden", "sm:w-72 sm:block")}>
      <div className="flex h-screen w-full flex-col gap-2 p-2">
        <UserProfile />
        <div className="custom-scrollbar h-auto flex-1 overflow-y-auto overscroll-none">
          <Nav navLists={navLists} />
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}

const Nav = ({
  navLists,
  isChild = false,
}: {
  navLists: NavigationType[];
  isChild?: boolean;
}) => {
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const segment = segments.pop();
  const queryClient = useQueryClient();
  const utils = useApiUtils();
  const confirmDialog = useConfirmDialog();
  const confirm = confirmDialog?.confirm;

  const [contextTarget, setContextTarget] = useState<NavigationType | null>(null);
  const [renameTarget, setRenameTarget] = useState<NavigationType | null>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchMoved = useRef(false);

  const updateMutation = api.categories.update.useMutation({
    onSuccess: async () => {
      await utils.categories.listAll.invalidate();
    },
  });

  const deleteMutation = api.categories.delete.useMutation({
    onSuccess: async () => {
      await utils.categories.listAll.invalidate();
      await utils.links.count.invalidate();
      router.push("/admin/dashboard");
      useAppStore.getState().setOpenMenu(false);
    },
  });

  const handleRoute = async (route: NavigationType) => {
    if (route.subRoute.length) {
      await queryClient.cancelQueries();
      router.push(route.subRoute[0]!.route);
    } else {
      await queryClient.cancelQueries();
      router.push(route.route);
      if (isMobile) {
        useAppStore.getState().setOpenMenu(false);
      }
    }
  };

  const startLongPress = (nav: NavigationType) => {
    if (nav.title === "dashboard") return;
    touchMoved.current = false;
    longPressTimer.current = setTimeout(() => {
      if (!touchMoved.current) {
        setContextTarget(nav);
      }
    }, 500);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchMove = () => {
    touchMoved.current = true;
    cancelLongPress();
  };

  const handlePin = () => {
    if (!contextTarget?.id) return;
    const newIsPinned = !contextTarget.isPinned;
    const targetId = contextTarget.id;

    const { categories, setCategories } = useAppStore.getState();
    setCategories(categories.map(c => c.id === targetId ? { ...c, isPinned: newIsPinned } : c));

    updateMutation.mutate({ id: targetId, title: contextTarget.title, isPinned: newIsPinned });
    setContextTarget(null);
  };

  const handleRenameOpen = () => {
    if (!contextTarget) return;
    setRenameTarget(contextTarget);
    setRenameValue(contextTarget.title);
    setRenameOpen(true);
    setContextTarget(null);
  };

  const handleRenameSubmit = () => {
    const trimmed = renameValue.trim();
    if (!trimmed || !renameTarget) return;
    updateMutation.mutate(
      { id: renameTarget.id!, title: trimmed, isPinned: renameTarget.isPinned },
      {
        onSuccess: () => {
          setRenameOpen(false);
          setRenameTarget(null);
          router.push("/admin/dashboard");
          useAppStore.getState().setOpenMenu(false);
        },
      },
    );
  };

  const handleDelete = () => {
    if (!contextTarget?.id || !confirm) return;
    const target = contextTarget;
    setContextTarget(null);
    confirm({
      title: "Delete Category",
      description: `Delete "${target.title}"? This will also delete all links in it.`,
      warningText: "This cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        deleteMutation.mutate([target.id!]);
      },
    });
  };

  return (
    <>
      <div className={cn("relative flex flex-col gap-1")}>
        {navLists.map((navigation) => (
          <Fragment key={navigation.route}>
            <DropdownMenu
              open={contextTarget?.route === navigation.route}
              onOpenChange={(open) => { if (!open) setContextTarget(null); }}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={twMerge(
                    "group flex w-full items-center justify-between rounded-md p-2 capitalize text-muted-foreground hover:bg-muted hover:text-foreground",
                    segment === navigation.title.toLowerCase().replaceAll(" ", "-") &&
                      !navigation.subRoute.length &&
                      "bg-muted font-medium text-foreground",
                    isChild && "pl-6",
                  )}
                  onClick={() => handleRoute(navigation)}
                  onTouchStart={() => startLongPress(navigation)}
                  onTouchEnd={cancelLongPress}
                  onTouchMove={handleTouchMove}
                >
                  <span className="flex items-center gap-1.5">
                    {navigation.isPinned && (
                      <DrawingPinFilledIcon className="h-3 w-3 shrink-0 text-primary" />
                    )}
                    <Label className="pointer-events-none select-none">{navigation.title}</Label>
                  </span>
                </button>
              </DropdownMenuTrigger>
              {navigation.title !== "dashboard" && (
                <DropdownMenuContent side="right" align="start" className="w-44">
                  <DropdownMenuItem onClick={handlePin}>
                    {navigation.isPinned ? (
                      <><DrawingPinFilledIcon className="mr-2 h-4 w-4" /> Unpin</>
                    ) : (
                      <><DrawingPinIcon className="mr-2 h-4 w-4" /> Pin</>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRenameOpen}>
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleDelete}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
            {!!navigation.subRoute.length && (
              <Nav navLists={navigation.subRoute} isChild={true} />
            )}
          </Fragment>
        ))}
      </div>

      {/* Rename dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename Category</DialogTitle>
          </DialogHeader>
          <input
            autoFocus
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleRenameSubmit(); }}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setRenameOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleRenameSubmit} disabled={!renameValue.trim()}>
              Rename
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
