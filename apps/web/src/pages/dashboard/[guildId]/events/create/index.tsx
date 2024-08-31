import { CreateEventInteractionForm } from "~/features/dashboard/events/create/_components/create-event-interaction-form";
import { CreateEventLimitForm } from "~/features/dashboard/events/create/_components/create-event-limit-form";
import { CreateEventNotficationsForm } from "~/features/dashboard/events/create/_components/create-event-notifications";
import { CreateEventSetupForm } from "~/features/dashboard/events/create/_components/create-event-setup-form";
import useAuth from "~/hooks/use-auth";
import useGetGuild from "~/hooks/use-get-guild";
import { CreateEventLayout } from "~/layouts/create-event-layout";
import { CreateEventCard } from "~/layouts/create-event-layout/create-event-card";
import DashboardLayout from "~/layouts/dashboard-layout";
import GlobalLoading from "~/layouts/global-loading";
import { useMultiStepCreateEventFormStore } from "~/state/create-event-multiform-store";

export default function CreateEventPage() {
  const { isLoading: isUserLoading } = useAuth();
  const { isLoading: isGuildsLoading } = useGetGuild();

  const currentStep = useMultiStepCreateEventFormStore(
    (state) => state.currentStep,
  );

  if (isUserLoading || isGuildsLoading) {
    return <GlobalLoading />;
  }

  return (
    <DashboardLayout>
      <CreateEventLayout>
        {currentStep === 1 && (
          <CreateEventCard
            title="Event Setup"
            description="Fill the basic information of your event"
          >
            <CreateEventSetupForm />
          </CreateEventCard>
        )}

        {currentStep === 2 && (
          <CreateEventCard
            title="Event Interactions"
            description="Add interactions emojis for participants to react to your event"
          >
            <CreateEventInteractionForm />
          </CreateEventCard>
        )}

        {currentStep === 3 && (
          <CreateEventCard
            title="Event Limit"
            description="Set the limit rules for your event"
          >
            <CreateEventLimitForm />
          </CreateEventCard>
        )}

        {currentStep === 4 && (
          <CreateEventCard
            title="Event Notifications"
            description="Set the notification for the event to discord members"
          >
            <CreateEventNotficationsForm />
          </CreateEventCard>
        )}
      </CreateEventLayout>
    </DashboardLayout>
  );
}
