import React, { useEffect } from "react";
import TextInput from "./text-input";
import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import { FilterFormValues, filterFormSchema } from "~/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";
import useAppStore from "~/store/app.store";
import { Button } from "~/components/ui/button";

const PageFilters = ({ className, placeholder }: { className?: string, placeholder?: string }) => {
  const { setFilters, setPage } = useAppStore((state) => ({
    setFilters: state.setFilters,
    setPage: state.setPage,
  }));

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      keyword: "",
    },
  });

  // Debounce filter updates by 500ms after typing
  const keyword = form.watch("keyword");
  useEffect(() => {
    const handle = setTimeout(() => {
      setFilters({ keyword });
      setPage(1);
    }, 500);
    return () => clearTimeout(handle);
  }, [keyword, setFilters]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-full flex items-center gap-2">
        <Form {...form}>
          <TextInput name="keyword" placeholder={placeholder} />
        </Form>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            form.reset({ keyword: "" });
            setFilters({ keyword: "" });
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default PageFilters;
