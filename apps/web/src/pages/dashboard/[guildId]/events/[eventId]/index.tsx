import EventSetupForm from "~/features/dashboard/[guildId]/events/[eventId]/components/event-setup-form";
import useAuth from "~/hooks/use-auth";
import useGetGuild from "~/hooks/use-get-guild";
import DashboardLayout from "~/layouts/dashboard-layout";
import EditEventLayout from "~/layouts/edit-event-layout";
import EditEventCard from "~/layouts/edit-event-layout/edit-event-card";
import GlobalLoading from "~/layouts/global-loading";

export default function EventPage() {
  const { isLoading: isUserLoading } = useAuth();
  const { isLoading: isGuildsLoading } = useGetGuild();

  if (isUserLoading || isGuildsLoading) {
    return <GlobalLoading />;
  }

  return (
    <DashboardLayout>
      <EditEventLayout>
        <EditEventCard
          title="Event Setup"
          description="Setup basic event information to get started"
        >
          <EventSetupForm />
        </EditEventCard>
      </EditEventLayout>
    </DashboardLayout>
  );
}
