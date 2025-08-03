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
import React, { useEffect, useState, useReducer } from "react";

// Form state type
export interface FormState {
  id?: number;
  title: string;
  url: string;
  description: string;
}

// Form actions
type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string | boolean }
  | { type: "SET_MULTIPLE_FIELDS"; fields: Partial<FormState> }
  | { type: "RESET_FORM" }
  | { type: "LOAD_DATA"; payload: Partial<FormState> };

// Initial form state
const initialFormState: FormState = {
  id: undefined,
  title: "",
  url: "",
  description: "",

};

// Form reducer
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "SET_MULTIPLE_FIELDS":
      return {
        ...state,
        ...action.fields,
      };
    case "RESET_FORM":
      return {
        ...initialFormState,
      };
    case "LOAD_DATA":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

type Props = {
  action: (formData: FormState) => void;
  title: string;
  description: string;
  label: string;
  initialData?: Partial<FormState>;
  defaultType?: string;
};
const CustomDialog = ({ title, description, label, action, initialData, defaultType }: Props) => {
  const [formData, dispatch] = useReducer(formReducer, initialFormState);
  const [errors, setErrors] = useState<{
    title?: string;
    url?: string;
  }>({});
  
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
      dispatch({ type: "LOAD_DATA", payload: initialData });
    }
  }, [modal, initialData, defaultType]);

  useEffect(() => {
    if (!modal) {
      setErrors({});
      dispatch({ type: "RESET_FORM" });
    }
  }, [modal]);

  // URL validation function
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors: { title?: string; url?: string } = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    // URL validation
    if (!formData.url.trim()) {
      newErrors.url = "URL is required";
    } else if (!isValidUrl(formData.url.trim())) {
      newErrors.url = "Please enter a valid URL (e.g., https://example.com)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const key = e.target.id as keyof FormState;
    const value = e.target.value;

    dispatch({
      type: "SET_FIELD",
      field: key,
      value: value,
    });

    // Clear specific field error when user starts typing
    if (errors[key as keyof typeof errors]) {
      setErrors({
        ...errors,
        [key]: undefined,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      action(formData);
    }
  };

  return (
    <Dialog onOpenChange={setModal} open={modal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div>
                <Input
                  id="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={errors.title ? "border-red-500" : ""}
                  required
                  autoFocus
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>
              <div>
                <Input
                  id="url"
                  placeholder="URL (e.g., https://example.com)"
                  value={formData.url}
                  onChange={handleInputChange}
                  className={errors.url ? "border-red-500" : ""}
                  required
                />
                {errors.url && (
                  <p className="text-sm text-red-500 mt-1">{errors.url}</p>
                )}
              </div>
              <Textarea
                id="description"
                placeholder="Description"
                value={formData.description || ""}
                onChange={handleInputChange}
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
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
