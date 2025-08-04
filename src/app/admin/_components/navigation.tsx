"use client";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import useAppStore from "~/store/app.store";
import { type NavigationType } from "~/utils/types";
import { useNavigationLists } from "~/utils/navigations";
import { Fragment, useState } from "react";
import CategoryForm from "./category-form";
import LogoutBtn from "./logout-btn";
import UserProfile from "./user-profile";
import DeleteCategoryDialog from "./delete-category-dialog";

export default function Navigation() {
  const navLists = useNavigationLists(); // Now reactive to category changes
  const [deleteCategory, setDeleteCategory] = useState<NavigationType | null>(null);

  const handleEdit = (nav: NavigationType) => {
    console.log("🚀 ~ handleEdit ~ nav:", nav);
  };
  
  const handleDelete = (nav: NavigationType) => {
    setDeleteCategory(nav);
  };

  const handleCloseDialog = () => {
    setDeleteCategory(null);
  };

  return (
    <>
      <div className="flex h-screen w-72 flex-col gap-2 p-2">
        <UserProfile />
        <div className="custom-scrollbar h-auto overflow-auto overscroll-none">
          <Nav {...{ navLists, handleEdit, handleDelete }} />
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <CategoryForm />
          <LogoutBtn />
        </div>
      </div>

      <DeleteCategoryDialog
        category={deleteCategory}
        isOpen={!!deleteCategory}
        onClose={handleCloseDialog}
      />
    </>
  );
}

const Nav = ({
  navLists,
  isChild = false,
  handleDelete,
  handleEdit,
}: {
  navLists: NavigationType[];
  isChild?: boolean;
  handleDelete?: (nav: NavigationType) => void;
  handleEdit?: (nav: NavigationType) => void;
}) => {
  const { openMenu, isLoading } = useAppStore((state) => ({
    openMenu: state.openMenu,
    isLoading: state.isLoading,
  }));
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const segment = segments.pop();

  const handleRoute = (route: NavigationType) => {
    if (route.subRoute.length) {
      router.push(route.subRoute[0]!.route);
    } else {
      router.push(route.route);
    }
  };

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col gap-2",
        openMenu ? "w-full" : "hidden",
      )}
    >
      {navLists.map((navigation) => (
        <Fragment key={navigation.route}>
          <div
            className={twMerge(
              "group flex items-center justify-between rounded-md p-2 capitalize hover:cursor-pointer hover:bg-gray-400 hover:text-gray-800",
              segment === navigation.title.toLowerCase().replaceAll(" ", "-") &&
                !navigation.subRoute.length &&
                "bg-gray-300 font-semibold text-gray-800",
              isChild && "pl-8",
            )}
            onClick={() => handleRoute(navigation)}
          >
            <Label className="select-none">{navigation.title}</Label>
            {segment === navigation.title.toLowerCase().replaceAll(" ", "-") && navigation.id !== 0 ? (
              <div className="flex gap-1">
                <div className="group rounded-full p-1 hover:bg-gray-900">
                  <Pencil1Icon
                    onClick={() => handleEdit && handleEdit(navigation)}
                    className={cn(
                      "h-4 w-4 text-gray-900 group-hover:text-gray-100",
                    )}
                  />
                </div>
                <div className="group rounded-full p-1 hover:bg-red-900">
                  <TrashIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete && handleDelete(navigation);
                    }}
                    className={cn(
                      "h-4 w-4 text-red-900 group-hover:text-red-100",
                    )}
                  />
                </div>
              </div>
            ) : null}
          </div>
          {!!navigation.subRoute.length && (
            <Nav navLists={navigation.subRoute} isChild={true} />
          )}
        </Fragment>
      ))}
    </div>
  );
};
