import { RiAddLine } from "react-icons/ri";

import { Button } from "@giverve/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@giverve/ui/dialog";

import CreateEventForm from "./create-event-form";

export default function ModalCreateEvent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <RiAddLine className="mr-1.5 size-5" />
          New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Create a new event for your community in discord server
          </DialogDescription>
        </DialogHeader>
        <CreateEventForm type="dialog" />
      </DialogContent>
    </Dialog>
  );
}
