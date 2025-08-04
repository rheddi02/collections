"use client";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import { categoryOutput } from "~/server/api/client/types";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { TextInput } from "./text-input";
import { useSession } from "next-auth/react";
import { toast } from "~/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

// Form schema
const categoryFormSchema = z.object({
  title: z
    .string()
    .min(1, "Category name is required")
    .max(40, "Category name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9.-]+$/,
      "Category name can only contain letters, numbers, hyphens (-), and periods (.)",
    ),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const CategoryForm = () => {
  const { data: session } = useSession();
  const [isAdd, setIsAdd] = useState(false);
  const [editingCategory, setEditingCategory] = useState<categoryOutput | null>(
    null,
  );
  const [showInvalidPopover, setShowInvalidPopover] = useState(false);
  const utils = api.useUtils();
  const popoverTimeoutRef = useRef<NodeJS.Timeout>();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      title: "",
    },
  });

  // Watch the title field for real-time validation
  const watchedTitle = form.watch("title");

  useEffect(() => {
    // Clear previous timeout
    if (popoverTimeoutRef.current) {
      clearTimeout(popoverTimeoutRef.current);
    }

    // Check for invalid characters with debounce
    const invalidChars = watchedTitle?.match(/[^a-zA-Z0-9.-]/g);
    if (invalidChars && watchedTitle.length > 0) {
      setShowInvalidPopover(true);
      // Auto-hide popover after 3 seconds only if there are invalid characters
      popoverTimeoutRef.current = setTimeout(() => {
        setShowInvalidPopover(false);
      }, 3000);
    } else if (watchedTitle?.length > 0) {
      // If there are no invalid characters but there's content, hide the popover
      setShowInvalidPopover(false);
    }
    // Don't hide popover when input is empty to keep it open for guidance
  }, [watchedTitle]);

  const { mutate: createData, isPending: pendingCreate } =
    api.create.category.useMutation({
      onSuccess: async () => {
        await utils.list.categories.invalidate();
        toast({
          title: "Success",
          description: "Category created successfully",
        });
        form.reset();
        setIsAdd(false);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const { mutate: updateData, isPending: pendingUpdate } =
    api.update.category.useMutation({
      onSuccess: async () => {
        await utils.list.categories.invalidate();
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
        form.reset();
        setIsAdd(false);
        setEditingCategory(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const { mutate: deleteData, isPending: pendingDelete } =
    api.delete.category.useMutation({
      onSuccess: async () => {
        await utils.list.coin.invalidate();
        await utils.list.categories.invalidate();
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const isLoading = pendingCreate || pendingUpdate || pendingDelete;

  const onSubmit = (data: CategoryFormValues) => {
    if (editingCategory) {
      // Update existing category
      updateData({
        id: editingCategory.id,
        title: data.title.trim(),
      });
    } else {
      // Create new category
      createData({
        title: data.title.trim(),
      });
    }
  };

  const handleAddCategory = () => {
    if (!session?.user.isVerified) {
      toast({
        title: "Verification Required",
        description: "Please verify your email to add categories.",
        variant: "destructive",
      });
      return;
    }
    setIsAdd(true);
    setEditingCategory(null);
    form.reset();
    setShowInvalidPopover(true); // Keep popover open when adding category
  };

  const handleCancel = () => {
    setIsAdd(false);
    setEditingCategory(null);
    form.reset();
    setShowInvalidPopover(false);
    // Clear any pending popover timeout
    if (popoverTimeoutRef.current) {
      clearTimeout(popoverTimeoutRef.current);
    }
  };

  // const onEdit = (row: Row<categoryOutput>) => {
  //   setEditingCategory(row.original);
  //   form.setValue("title", row.original.title);
  //   setIsAdd(true);
  // };

  // const onDelete = (row: Row<categoryOutput>) => {
  //   deleteData(row.original.id);
  // };

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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="flex flex-col gap-2 bg-gray-900 ">
                  <p className="mt-1 text-xs text-gray-100 p-1">
                    Category name can only contain letters, numbers, hyphens
                    (-), and periods (.)
                  </p>
                </div>
            <div className="w-full">
                  <TextInput
                    name="title"
                    placeholder="Enter category name"
                    disabled={isLoading}
                    className="border-muted-500 focus:border-muted-700 w-full border focus:ring-2 focus:ring-green-200"
                    autoFocus
                    required
                  />
                </div>
            {/* <Popover
              open={showInvalidPopover}
              onOpenChange={setShowInvalidPopover}
            >
              <PopoverTrigger asChild>
                <div className="w-full">
                  <TextInput
                    name="title"
                    placeholder="Enter category name"
                    disabled={isLoading}
                    className="border-muted-500 focus:border-muted-700 w-full border focus:ring-2 focus:ring-green-200"
                    autoFocus
                    required
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="border-red-200 bg-red-50 p-3"
                side="top"
                align="start"
                style={{ width: "var(--radix-popover-trigger-width)" }}
              >
                <div className="flex items-start gap-2">
                  <p className="mt-1 text-xs text-gray-900">
                    Category name can only contain letters, numbers, hyphens
                    (-), and periods (.)
                  </p>
                </div>
              </PopoverContent>
            </Popover> */}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant={"ghost"}
                size={"sm"}
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={"secondary"}
                size={"sm"}
                className="flex-grow"
                disabled={isLoading || !form.watch("title")?.trim()}
              >
                {isLoading ? "Saving..." : editingCategory ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CategoryForm;
