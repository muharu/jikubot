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

  const previousStep = useMultiStepCreateEventFormStore(
    (state) => state.previousStep,
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
            title="Event Setup"
            description="Fill the basic information of your event"
          >
            Content 2<button onClick={previousStep}>Previous</button>
          </CreateEventCard>
        )}
      </CreateEventLayout>
    </DashboardLayout>
  );
}
