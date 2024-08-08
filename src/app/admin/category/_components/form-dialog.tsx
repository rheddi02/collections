import type { categoryOutput, categoryInput } from "~/server/api/client/types";
import {
  ReloadIcon,
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
import { Button } from "~/components/ui/button";

type Props = {
  formData: categoryInput
  setFormData: (data: categoryInput) => void;
  action: () => void;
};
const FormDialog = ({ formData, setFormData, action }: Props) => {
  const { modal, setModal, isLoading } = useAppStore((state) => ({
    modal: state.modal,
    setModal: state.setModal,
    isLoading: state.isLoading,
  }));

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

  return (
    <Dialog onOpenChange={setModal} open={modal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>Add New</DialogTitle>
          <DialogDescription>Add new category</DialogDescription>
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
