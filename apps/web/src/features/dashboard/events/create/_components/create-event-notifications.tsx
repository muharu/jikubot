import { Button } from "@giverve/ui/button";

import { useMultiStepCreateEventFormStore } from "~/state/create-event-multiform-store";

export function CreateEventNotficationsForm() {
  const previousStep = useMultiStepCreateEventFormStore(
    (state) => state.previousStep,
  );

  return (
    <div className="flex items-center justify-between">
      <Button onClick={previousStep}>Back</Button>
    </div>
  );
}
