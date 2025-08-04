"use client";
import React, { useState } from "react";
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

// Form schema
const categoryFormSchema = z.object({
  title: z.string().min(1, "Category name is required").max(50, "Category name must be less than 50 characters"),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const CategoryForm = () => {
  const { data: session } = useSession();
  const [isAdd, setIsAdd] = useState(false);
  const [editingCategory, setEditingCategory] = useState<categoryOutput | null>(null);
  const utils = api.useUtils();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      title: "",
    },
  });

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
  };

  const handleCancel = () => {
    setIsAdd(false);
    setEditingCategory(null);
    form.reset();
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
            <TextInput
              name="title"
              placeholder="Enter category name"
              disabled={isLoading}
              className="border border-muted-500 focus:border-muted-700 focus:ring-2 focus:ring-green-200"
              autoFocus
              required
            />
            
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
