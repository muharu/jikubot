import dynamic from "next/dynamic";

import useAuth from "~/hooks/use-auth";
import useGetGuild from "~/hooks/use-get-guild";
import DashboardLayout from "~/layouts/dashboard-layout";
import GlobalLoading from "~/layouts/global-loading";

const DrawerCreateEvent = dynamic(
  () =>
    import(
      "~/features/dashboard/[guildId]/events/components/drawer-create-event"
    ),
  { ssr: false },
);

const ModalCreateEvent = dynamic(
  () =>
    import(
      "~/features/dashboard/[guildId]/events/components/modal-create-event"
    ),
  { ssr: false },
);

export default function Dashboard() {
  const { isLoading: isUserLoading } = useAuth();
  const { isLoading: isGuildsLoading } = useGetGuild();

  if (isUserLoading || isGuildsLoading) {
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
