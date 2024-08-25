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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@giverve/ui/drawer";

import CreateEventForm from "~/features/dashboard/[guildId]/events/components/create-event-form";
import useDashboardCheck from "~/hooks/use-dashboard-check";
import DashboardLayout from "~/layouts/dashboard-layout";
import GlobalLoading from "~/layouts/global-loading";

export default function Dashboard() {
  const { isLoading, isInGuilds } = useDashboardCheck();

  if (isLoading || !isInGuilds) {
    return <GlobalLoading />;
  }

  return (
    <DashboardLayout>
      <main>
        <div className="hidden items-center justify-between lg:flex">
          <div className="flex flex-col">
            <h1 className="text-2xl">Events</h1>
            <span>Create new event for your community in discord server</span>
          </div>
          <ModalCreateButton />
        </div>
        <DrawerCreateButton />
      </main>
    </DashboardLayout>
  );
}

function ModalCreateButton() {
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

function DrawerCreateButton() {
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
