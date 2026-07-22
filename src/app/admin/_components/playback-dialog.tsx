'use client";'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { isPlayableVideo } from "~/utils/helpers";
import { UpdateLinkValues } from "~/utils/schemas";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

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

  if (!link) return null;

  const playable = isPlayableVideo(link.url || '');

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh]">
          <DialogHeader>
            <DialogTitle>{link.title}</DialogTitle>
            <DialogDescription>{link.description}</DialogDescription>
          </DialogHeader>
          <div className="mx-auto w-full">
            {playable ? (
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                <ReactPlayer
                  url={link.url}
                  controls
                  playing
                  width="100%"
                  height="100%"
                  style={{ position: "absolute", top: 0, left: 0 }}
                />
              </div>
            ) : (
              <div>Playback not available for this source</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default PlaybackDialog;
