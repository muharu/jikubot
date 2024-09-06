import { useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";

import { Button } from "@giverve/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@giverve/ui/dialog";

import { EditEmojiForm } from "./edit-interaction-form";

interface IEditInteractionButtonProps {
  interactionId: string;
}

export function EditInteractionButton({
  interactionId,
}: Readonly<IEditInteractionButtonProps>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="reverse">
          <AiTwotoneEdit className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Interaction</DialogTitle>
          <DialogDescription>
            Edit the interaction details below.
          </DialogDescription>
        </DialogHeader>
        <EditEmojiForm
          setIsDialogOpen={setIsDialogOpen}
          interactionId={interactionId}
        />
      </DialogContent>
    </Dialog>
  );
}
