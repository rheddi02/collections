import { Fragment, useState } from "react";
import ReactPlayer from "react-player";
import type { categoryOutput, coinInput, videoOutput } from "~/server/api/client/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import {
  ArrowTopRightIcon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import useAppStore from "~/store/app.store";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Type } from "@prisma/client";

type Props = {
  formData: coinInput
  setFormData: (data: coinInput) => void;
  action: () => void;
  categories: categoryOutput[] | undefined
};
const FormDialog = ({ formData, setFormData, action, categories }: Props) => {
  const { modal, setModal, isLoading } = useAppStore((state) => ({
    modal: state.modal,
    setModal: state.setModal,
    isLoading: state.isLoading,
  }));

  const openUrl = (url: string) => {
    window.open(url, "_blank");
  };

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
  const handleTypeChange = (data: Type) => {
    setFormData({
      ...formData,
      type: data,
    });
  };

  return (
    <Dialog onOpenChange={setModal} open={modal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>Add New</DialogTitle>
          <DialogDescription>Add new coin to collect</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              id="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
            />
            <Textarea
              id="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
            />
            <Input
              id="url"
              placeholder="Url"
              value={formData.url}
              onChange={handleInputChange}
            />
            <Input
              id="year"
              placeholder="Year Model"
              value={formData.year}
              onChange={handleInputChange}
            />
            <Select
              onValueChange={handleTypeChange}
              defaultValue={formData.type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent id="type" className="capitalize">
                {['OLD','NEW','SPECIAL']?.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={handleOptionChange}
              defaultValue={formData.type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent id="type" className="capitalize">
                {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading}
            onClick={action}
            className="flex items-center gap-2"
          >
            {isLoading && <ReloadIcon className="animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
