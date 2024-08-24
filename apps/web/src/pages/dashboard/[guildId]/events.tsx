import { RiAddLine } from "react-icons/ri";

import { Button } from "@giverve/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@giverve/ui/dialog";

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

        <div className="mt-8">
          <div className="min-h-20 rounded-md border border-border"></div>
          <div className="min-h-20 rounded-md border-l border-r border-border"></div>
          <div className="min-h-20 rounded-md border border-border"></div>
        </div>
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
      <DialogContent className="sm:max-w-[425px]"></DialogContent>
    </Dialog>
  );
}
