import { PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import { Button } from "~/components/ui/button";

type Props = {
  action?: () => void;
  label: string;
} & React.ComponentProps<typeof Button>;

const PageAction = React.forwardRef<
  React.ElementRef<typeof Button>,
  Props
>(({ label, action, onClick, ...props }, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // If there's a custom action, call it
    if (action) {
      action();
    }
    // If there's an onClick prop (from PopoverTrigger), call it
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Button 
      ref={ref}
      onClick={handleClick} 
      className="sm:flex gap-2 w-full" 
      variant="outline"
      {...props}
    >
      <PlusIcon className="h-4 w-4" />
      {label}
    </Button>
  );
});

PageAction.displayName = "PageAction";

export default PageAction;
