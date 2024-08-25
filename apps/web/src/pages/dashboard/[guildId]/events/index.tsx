import DrawerCreateEvent from "~/features/dashboard/[guildId]/events/components/drawer-create-event";
import ModalCreateEvent from "~/features/dashboard/[guildId]/events/components/modal-create-event";
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
          <ModalCreateEvent />
        </div>
        <DrawerCreateEvent />
      </main>
    </DashboardLayout>
  );
}
