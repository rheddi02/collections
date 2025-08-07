import { PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import { Button } from "~/components/ui/button";

type Props = {
  action: () => void;
  label: string;
};

const PageAction = ({ label, action }: Props) => {
  return (
    <Button onClick={action} className="flex gap-2">
      <PlusIcon className="h-4 w-4" />
      {label}
    </Button>
  );
};

export default PageAction;
