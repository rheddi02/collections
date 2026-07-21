'use client";'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { isPlayableVideo } from "~/utils/helpers";
import { UpdateLinkValues } from "~/utils/schemas";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type Props = {
  link: UpdateLinkValues | null;
};

type VideoSize = "small" | "medium" | "large";

const sizeMap: Record<VideoSize, { width: string; maxWidth: string }> = {
  small: { width: "100%", maxWidth: "400px" },
  medium: { width: "100%", maxWidth: "700px" },
  large: { width: "100%", maxWidth: "100%" },
};

const PlaybackDialog = ({ link }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const [size, setSize] = useState<VideoSize>("medium")

  useEffect(() => {
    setOpen(!!link?.url)
    return () => {
      setOpen(false)
    }
  }, [link])

  if (!link) return null;

  const sizeStyles = sizeMap[size];
  const playable = isPlayableVideo(link.url || '');

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{link.title}</DialogTitle>
            <DialogDescription>{link.description}</DialogDescription>
          </DialogHeader>
          <div style={sizeStyles} className="mx-auto">
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
          <DialogFooter className="flex gap-2 justify-center">
            <Button 
              variant={size === "small" ? "default" : "outline"}
              onClick={() => setSize("small")}
            >
              Small
            </Button>
            <Button 
              variant={size === "medium" ? "default" : "outline"}
              onClick={() => setSize("medium")}
            >
              Medium
            </Button>
            <Button 
              variant={size === "large" ? "default" : "outline"}
              onClick={() => setSize("large")}
            >
              Large
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
};

export default PlaybackDialog;
