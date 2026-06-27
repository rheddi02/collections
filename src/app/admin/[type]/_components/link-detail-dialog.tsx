"use client";
import { ExternalLinkIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { getSource } from "~/utils/helpers";
import { UpdateLinkValues } from "~/utils/schemas";

interface Props {
  link: UpdateLinkValues | null;
  onClose: () => void;
  onEdit: (link: UpdateLinkValues) => void;
  onDelete: (link: UpdateLinkValues) => void;
}

const LinkDetailDialog = ({ link, onClose, onEdit, onDelete }: Props) => {
  return (
    <Dialog open={!!link} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold leading-snug capitalize">
            {link?.title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Source</span>
            <span className="text-sm font-medium">{link ? getSource(link.url) : ""}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">URL</span>
            <a
              href={link?.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 break-all text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              {link?.url}
              <ExternalLinkIcon className="size-3 shrink-0" />
            </a>
          </div>
          {link?.description && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Description</span>
              <p className="text-sm leading-relaxed text-foreground">{link.description}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => link && onDelete(link)}
          >
            <TrashIcon className="size-4 text-destructive" />
            Delete
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => link && onEdit(link)}
          >
            <Pencil1Icon className="size-4" />
            Edit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkDetailDialog;
