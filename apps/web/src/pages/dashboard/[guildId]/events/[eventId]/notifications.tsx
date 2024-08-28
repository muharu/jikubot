import useAuth from "~/hooks/use-auth";
import useGetGuild from "~/hooks/use-get-guild";
import DashboardLayout from "~/layouts/dashboard-layout";
import EditEventLayout from "~/layouts/edit-event-layout";
import EditEventCard from "~/layouts/edit-event-layout/edit-event-card";
import GlobalLoading from "~/layouts/global-loading";

export default function EventNotifications() {
  const { isLoading: isUserLoading } = useAuth();
  const { isLoading: isGuildsLoading } = useGetGuild();

  if (isUserLoading || isGuildsLoading) {
    return <GlobalLoading />;
  }

  return (
    <DashboardLayout>
      <EditEventLayout>
        <EditEventCard
          title="Event Notifications"
          description="Setup notification for your event"
        >
          Content Here
        </EditEventCard>
      </EditEventLayout>
    </DashboardLayout>
  );
}
