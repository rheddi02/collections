"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import TextInput from "~/app/admin/_components/text-input";
import useAppStore from "~/store/app.store";
import { ReloadIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { linkFormSchema, LinkFormValues, UpdateLinkValues } from "~/utils/schemas";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";

type Props<T> = {
  action: (formData: T) => void;
  title: string;
  description: string;
  open: boolean;
  label: string;
  initialData?: Partial<T>;
};

const CreateFormDialog = ({ action, title, description, open, label, initialData }: Props<LinkFormValues | UpdateLinkValues>) => {
  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
    },
  });
  
  const {
    modal,
    setModal,
    isLoading,
  } = useAppStore((state) => ({
    modal: state.modal,
    setModal: state.setModal,
    isLoading: state.isLoading,
  }));

  // Load initial data when modal opens or initialData changes
  useEffect(() => {
    if (modal && initialData) {
      form.reset({
        id: initialData.id,
        title: initialData.title || "",
        url: initialData.url || "",
        description: initialData.description || "",
      })
    }
  }, [modal, initialData, form]);

  // Reset when modal becomes false
  useEffect(() => {
    if (!modal) {
      form.reset({
        id: undefined,
        title: "",
        url: "",
        description: "",
      });
    }
  }, [modal, form]);

  const handleSubmit = (values: LinkFormValues) => {
    action(values);
    // Note: The action should handle closing the dialog by calling setModal(false)
    // We'll listen for modal state changes to hide the global dialog
  };

  const handleCancel = () => {
    form.reset({
      id: undefined,
      title: "",
      url: "",
      description: "",
    });
    setModal(false);
  };

  return (
    <Dialog open={modal} onOpenChange={setModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <TextInput name="title" placeholder="Title" required autoFocus />
                <TextInput name="url" placeholder="URL (e.g., https://example.com)" required />
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit" className="flex items-center gap-2 capitalize">
                {isLoading && <ReloadIcon className="animate-spin" />}
                {label}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFormDialog;
