"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import TextInput from "../../_components/text-input";
import { categoryFormSchema, CategoryFormValues } from "~/utils/schemas";
import { useApiUtils } from "~/hooks";

const CreateCategoryPopover = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      title: "",
    },
  });

  const utils = useApiUtils();

  const createCategoryMutation = api.create.category.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      form.reset();
      setOpen(false);
      // Invalidate categories to refetch
      await utils.list.categories.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    createCategoryMutation.mutate({
      title: data.title.trim(),
    });
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="flex gap-2">
          <PlusIcon className="h-4 w-4" />
          Add New
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Create New Category</h4>
              <div className="flex flex-col gap-2 bg-gray-900 rounded p-2">
                <p className="text-xs text-gray-100">
                  Category name can only contain letters, numbers, hyphens (-), and periods (.)
                </p>
              </div>
            </div>
            <div className="w-full">
              <TextInput
                name="title"
                placeholder="Enter category name"
                disabled={createCategoryMutation.isPending}
                className="border-muted-500 focus:border-muted-700 w-full border focus:ring-2 focus:ring-green-200"
                autoFocus
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={createCategoryMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                className="flex-grow"
                disabled={createCategoryMutation.isPending || !form.watch("title")?.trim()}
              >
                {createCategoryMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default CreateCategoryPopover;
