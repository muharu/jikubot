import { useState } from "react";

import { Button } from "@giverve/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@giverve/ui/dialog";

import { AddEmojiForm } from "./add-emoji-form";

export function EmojiDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add Emoji</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Emoji</DialogTitle>
          <DialogDescription>
            Choose an emoji to add to your event.
          </DialogDescription>
        </DialogHeader>
        <AddEmojiForm setIsDialogOpen={setIsDialogOpen} />
      </DialogContent>
    </Dialog>
  );
}
