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
import { typeLists } from "~/utils/type-list";
import React, { useEffect, useState } from "react";

type Props = {
  action: () => void;
  title: string;
  description: string;
  label: string;
};
const CustomDialog = ({ title, description, label, action }: Props) => {
  const [lists] = useState(typeLists);
  const { resetForm, modal, setModal, isLoading, actionable, formData, setFormData } =
    useAppStore((state) => ({
      resetForm: state.resetForm,
      modal: state.modal,
      setModal: state.setModal,
      isLoading: state.isLoading,
      actionable: state.actionable,
      formData: state.formData,
      setFormData: state.setFormData,
    }));

    useEffect( () => {
      if (!modal) resetForm()
    },[modal])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const key = e.target.id
    const value = e.target.value

    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleOptionChange = (data: string) => {
    setFormData({
      ...formData,
      type: data,
    });
  };

  return (
    <Dialog onOpenChange={setModal} open={modal}>
      <DialogContent className="sm:max-w-[425px]" >
        <DialogHeader className="text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              id="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
            />
            <Input
              id="url"
              placeholder="Url"
              value={formData.url}
              onChange={handleInputChange}
            />
            <Textarea
              id="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
            />
            <Select
              onValueChange={handleOptionChange}
              defaultValue={formData.type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent id="type" className="capitalize">
                {lists.sort( (a,b) => a.label.localeCompare(b.label)).map((list) => (
                  <SelectItem key={list.value} value={list.value}>
                    {list.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading || !actionable}
            onClick={action}
            className="flex items-center gap-2 capitalize"
          >
            {isLoading && <ReloadIcon className="animate-spin" />}
            {label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
