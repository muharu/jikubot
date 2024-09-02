import { Button } from "@giverve/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@giverve/ui/dialog";
import { Input } from "@giverve/ui/input";

import { GuildEmojisCombobox } from "./guild-emojis-combobox";

export function EmojiDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Emoji to Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Emoji</DialogTitle>
          <DialogDescription>
            Choose an emoji to add to your event.
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-y-2">
          <GuildEmojisCombobox />
          <Input placeholder="e.g Join/Tentative" />
        </div>
        <DialogFooter>
          <Button type="submit" className="font-semibold">
            Add Emoji
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
