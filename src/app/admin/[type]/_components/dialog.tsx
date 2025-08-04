"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { TextInput } from "~/app/admin/_components/text-input";
import useAppStore from "~/store/app.store";
import { ReloadIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";

// Form schema
const formSchema = z.object({
  id: z.number().optional(),
  title: z.string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters"),
  url: z.string()
    .min(1, "URL is required")
    .url("Please enter a valid URL (e.g., https://example.com)"),
  description: z.string().optional(),
})

// Form state type
export type FormState = z.infer<typeof formSchema>

type Props = {
  action: (formData: FormState) => void;
  title: string;
  description: string;
  label: string;
  initialData?: Partial<FormState>;
  defaultType?: string;
};

const CustomDialog = ({ title, description, label, action, initialData, defaultType }: Props) => {
  const form = useForm<FormState>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: undefined,
      title: "",
      url: "",
      description: "",
    },
  })
  
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

  useEffect(() => {
    if (!modal) {
      form.reset({
        id: undefined,
        title: "",
        url: "",
        description: "",
      })
    }
  }, [modal, form]);

  const handleSubmit = (values: FormState) => {
    action(values);
  };

  return (
    <Dialog onOpenChange={setModal} open={modal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <TextInput
                  name="title"
                  placeholder="Title"
                  required
                  autoFocus
                />
                <TextInput
                  name="url"
                  placeholder="URL (e.g., https://example.com)"
                  required
                />
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={isLoading}
                type="submit"
                className="flex items-center gap-2 capitalize"
              >
                {isLoading && <ReloadIcon className="animate-spin" />}
                {label}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
