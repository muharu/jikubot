import { useState } from "react";

import type { EventInteraction } from "@giverve/validators";
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

import { useMultiStepCreateEventFormStore } from "~/state/create-event-multiform-store";
import { GuildEmojisCombobox } from "./guild-emojis-combobox";

export function EmojiDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [value, setValue] = useState<EventInteraction | null>(null);
  const [name, setName] = useState("");

  const addInteraction = useMultiStepCreateEventFormStore(
    (state) => state.addInteraction,
  );

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (value) {
      addInteraction({
        ...value,
        name,
      });
    }
    setIsDialogOpen(false);
  }

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
        <form onSubmit={handleSubmit}>
          <div className="flex w-full flex-col gap-y-2">
            <GuildEmojisCombobox value={value} setValue={setValue} />
            <Input
              placeholder="e.g Join/Tentative"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" className="font-semibold">
              Add Emoji
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
