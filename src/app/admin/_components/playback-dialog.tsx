'use client";'
import { useEffect, useState } from "react";
import FacebookReel from "~/components/facebook-reel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import YouTubeEmbed from "~/components/youtube-embed";
import { getSource, getYouTubeId } from "~/utils/helpers";
import { UpdateLinkValues } from "~/utils/schemas";

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
  const [source, setSource] = useState('')
  const [size, setSize] = useState<VideoSize>("medium")

  useEffect(() => {
    setOpen(!!link?.url)
    const sourceName = getSource(link?.url || '').toLocaleLowerCase()
    setSource(sourceName)
    return () => {
      setOpen(false)
      setSource('')
    }
  }, [link])

  if (!link) return null;
  
  const sizeStyles = sizeMap[size];

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{link.title}</DialogTitle>
            <DialogDescription>{link.description}</DialogDescription>
          </DialogHeader>
          <div style={sizeStyles} className="mx-auto">
            {source=='facebook' ? <FacebookReel url={link.url || ''} />
            : source=='youtube' ? <YouTubeEmbed videoId={getYouTubeId(link.url) || ''} />
            : <div>Playback not available for this source</div>}
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
