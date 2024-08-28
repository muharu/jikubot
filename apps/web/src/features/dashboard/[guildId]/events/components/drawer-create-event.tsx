import { RiAddLine } from "react-icons/ri";

import { Button } from "@giverve/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@giverve/ui/drawer";

import CreateEventForm from "./create-event-form";

export default function DrawerCreateEvent() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          variant="noShadow"
          className="absolute bottom-10 right-5 h-14 w-14 rounded-full lg:hidden"
        >
          <RiAddLine className="size-8" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="px-4">
          <DrawerHeader>
            <DrawerTitle>Create Event</DrawerTitle>
            <DrawerDescription>
              Create a new event for your community
            </DrawerDescription>
          </DrawerHeader>
          <CreateEventForm type="drawer" />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
