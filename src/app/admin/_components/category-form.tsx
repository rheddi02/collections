"use client";
import React, { useEffect, useReducer, useState } from "react";
import useAppStore from "~/store/app.store";
import { api } from "~/trpc/react";
import type { Row } from "@tanstack/react-table";
import { categoryOutput } from "~/server/api/client/types";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";

// Form state type
interface FormState {
  title: string;
  isLoading: boolean;
}

// Form actions
type FormAction =
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET_FORM" }
  | { type: "EDIT_MODE"; payload: categoryOutput };

// Initial form state
const initialFormState: FormState = {
  title: "",
  isLoading: false,
};

// Form reducer
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_TITLE":
      return {
        ...state,
        title: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "RESET_FORM":
      return {
        ...initialFormState,
      };
    case "EDIT_MODE":
      return {
        ...state,
        title: action.payload.title,
      };
    default:
      return state;
  }
}

const CategoryForm = () => {
  const { data: session } = useSession();
  const { setCategories } = useAppStore((state) => ({
    setCategories: state.setCategories,
  }));

  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [isAdd, setIsAdd] = useState(false);
  const utils = api.useUtils();

  const { mutate: createData, isPending: pendingCreate } =
    api.create.category.useMutation({
      onSuccess: async () => {
        await utils.list.categories.invalidate(); // Also invalidate categories for navigation update
      },
      onSettled: () => {
        dispatch({ type: "SET_LOADING", payload: false });
        dispatch({ type: "RESET_FORM" });
        setIsAdd(false);
      },
    });

  const { mutate: updateData, isPending: pendingUpdate } =
    api.update.category.useMutation({
      onSuccess: async () => {
        await utils.list.categories.invalidate(); // Also invalidate categories for navigation update
      },
      onSettled: () => {
        dispatch({ type: "RESET_FORM" });
        setIsAdd(false);
      },
    });

  const { mutate: deleteData, isPending: pendingDelete } =
    api.delete.category.useMutation({
      onSuccess: async () => {
        await utils.list.coin.invalidate();
        await utils.list.categories.invalidate(); // Also invalidate categories for navigation update
      },
    });

  // Update loading state when mutations are pending
  useEffect(() => {
    dispatch({
      type: "SET_LOADING",
      payload: pendingCreate || pendingUpdate || pendingDelete,
    });
  }, [pendingCreate, pendingUpdate, pendingDelete]);

  const handleSave = () => {
    if (formState.title.trim()) {
      createData({
        title: formState.title.trim(),
      });
    }
  };

  const handleUpdate = () => {
    // For update, we need the full categoryOutput object
    // This would need to be passed from the parent component
    // For now, just log that update is called
    console.log("Update called for:", formState.title);
  };

  const onEdit = (row: Row<categoryOutput>) => {
    dispatch({ type: "EDIT_MODE", payload: row.original });
    setIsAdd(true); // Show the form when editing
  };

  const onDelete = (row: Row<categoryOutput>) => {
    deleteData(row.original.id);
  };

  // Function to handle input changes
  const handleTitleChange = (value: string) => {
    dispatch({ type: "SET_TITLE", payload: value });
  };

  const handleAddCategory = () => {
    if (!session?.user.isVerified) {
      alert("Please verify your email to add categories.");
      return;
    }
    setIsAdd(true);
    dispatch({ type: "RESET_FORM" });
  };

  return (
    <div className="flex flex-col gap-4">
      {!isAdd ? (
        <Button
          variant={"ghost"}
          size={"sm"}
          className="text-xs"
          onClick={handleAddCategory}
        >
          Add Category
        </Button>
      ) : (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="flex flex-col gap-2"
        >
          <Input
            className="border border-green-500 focus:border-green-700 focus:ring-2 focus:ring-green-200"
            name="category"
            value={formState.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter category name"
            disabled={formState.isLoading}
            autoFocus
            required
          />
          <div className="flex justify-end gap-2">
            <Button 
              type="button"
              variant={"ghost"} 
              size={"sm"} 
              onClick={() => {
                setIsAdd(false);
                dispatch({ type: "RESET_FORM" });
              }}
              disabled={formState.isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant={"secondary"} 
              size={"sm"} 
              className="flex-grow"
              disabled={formState.isLoading || !formState.title.trim()}
            >
              {formState.isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CategoryForm;
