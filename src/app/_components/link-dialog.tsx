"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import useAppStore from "~/store/app.store";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import React, { useEffect } from "react";

type Props = {
  action: () => void;
  title: string;
  description: string;
  label: string;
};
const LinkDialog = ({ title, description, label, action }: Props) => {
  const {
    resetForm,
    modal,
    setModal,
    isLoading,
    actionable,
    formData,
    setFormData,
    categories
  } = useAppStore((state) => ({
    categories: state.categories,
    resetForm: state.resetForm,
    modal: state.modal,
    setModal: state.setModal,
    isLoading: state.isLoading,
    actionable: state.actionable,
    formData: state.formData,
    setFormData: state.setFormData,
  }));

  useEffect(() => {
    if (!modal) resetForm();
  }, [modal]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const key = e.target.id;
    const value = e.target.value;

    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleOptionChange = (data: string) => {
    setFormData({
      ...formData,
      categoryId: +data,
    });
  };

  return (
    <Dialog onOpenChange={setModal} open={modal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            action();
          }}
        >
          <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="url" className="text-sm font-medium">
                  URL <span className="text-red-500">*</span>
                </label>
                <Input
                  id="url"
                  placeholder="Url"
                  value={formData.url}
                  onChange={handleInputChange}
                  type="url"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </label>
                <Select
                  onValueChange={handleOptionChange}
                  value={formData.categoryId?.toString()}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent id="categoryId" className="capitalize">
                    {categories
                      .sort((a, b) => a.title.localeCompare(b.title))
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Visibility <span className="text-red-500">*</span>
                </label>
                <Select
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      isPublic: value === "public",
                    })
                  }
                  value={formData.isPublic ? "public" : "private"}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Publish" />
                  </SelectTrigger>
                  <SelectContent id="isPublic" className="capitalize">
                    {["public", "private"].map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
          </div>
          <DialogFooter>
            <Button
              disabled={
                isLoading || 
                !actionable || 
                !formData.title || 
                !formData.url || 
                !formData.categoryId
              }
              type="submit"
              className="flex items-center gap-2 capitalize"
            >
              {isLoading && <ReloadIcon className="animate-spin" />}
              {label}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LinkDialog;
