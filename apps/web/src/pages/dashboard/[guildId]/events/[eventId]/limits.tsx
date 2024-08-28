import useDashboardCheck from "~/hooks/use-dashboard-check";
import DashboardLayout from "~/layouts/dashboard-layout";
import EditEventLayout from "~/layouts/edit-event-layout";
import EditEventCard from "~/layouts/edit-event-layout/edit-event-card";
import GlobalLoading from "~/layouts/global-loading";

export default function EventLimits() {
  const { isLoading, isInGuilds } = useDashboardCheck();

  if (isLoading || !isInGuilds) {
    return <GlobalLoading />;
  }

  return (
    <DashboardLayout>
      <EditEventLayout>
        <EditEventCard
          title="Event Limits"
          description="Setup limitation for your event"
        >
          Content Here
        </EditEventCard>
      </EditEventLayout>
    </DashboardLayout>
  );
}
