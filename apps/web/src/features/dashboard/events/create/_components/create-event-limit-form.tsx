import { Button } from "@giverve/ui/button";

import { useMultiStepCreateEventFormStore } from "~/state/create-event-multiform-store";

export function CreateEventLimitForm() {
  const previousStep = useMultiStepCreateEventFormStore(
    (state) => state.previousStep,
  );

  const nextStep = useMultiStepCreateEventFormStore((state) => state.nextStep);

  return (
    <div className="flex items-center justify-between">
      <Button onClick={previousStep}>Back</Button>
      <Button onClick={nextStep}>Next</Button>
    </div>
  );
}
