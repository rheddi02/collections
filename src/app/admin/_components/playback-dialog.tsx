'use client";'
import { useEffect, useState } from "react";
import FacebookReel from "~/components/facebook-reel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { UpdateLinkValues } from "~/utils/schemas";

type Props = {
  link: UpdateLinkValues | null;
};

const PlaybackDialog = ({ link }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  useEffect(() => {
    setOpen(!!link?.url)
  
    return () => {
      setOpen(false)
    }
  }, [link])
  
  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{link?.title}</DialogTitle>
            <DialogDescription>{link?.description}</DialogDescription>
            <FacebookReel url={link?.url || ''} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
  );
};

export default PlaybackDialog;
