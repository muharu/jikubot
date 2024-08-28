import EventSetupForm from "~/features/dashboard/[guildId]/events/[eventId]/components/event-setup-form";
import useDashboardCheck from "~/hooks/use-dashboard-check";
import DashboardLayout from "~/layouts/dashboard-layout";
import EditEventLayout from "~/layouts/edit-event-layout";
import EditEventCard from "~/layouts/edit-event-layout/edit-event-card";
import GlobalLoading from "~/layouts/global-loading";

export default function EventPage() {
  const { isLoading, isInGuilds } = useDashboardCheck();

  if (isLoading || !isInGuilds) {
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
