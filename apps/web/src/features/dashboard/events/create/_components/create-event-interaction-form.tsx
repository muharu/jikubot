import { Button } from "@giverve/ui/button";

import { useMultiStepCreateEventFormStore } from "~/state/create-event-multiform-store";
import { EmojiDialog } from "./add-emoji-dialog";

export function CreateEventInteractionForm() {
  const previousStep = useMultiStepCreateEventFormStore(
    (state) => state.previousStep,
  );

  const nextStep = useMultiStepCreateEventFormStore((state) => state.nextStep);

  return (
    <main>
      <div className="mb-36 flex gap-x-2">
        <EmojiDialog />
      </div>

      <div className="flex items-center justify-between">
        <Button onClick={previousStep}>Back</Button>
        <Button onClick={nextStep}>Next</Button>
      </div>
    </main>
  );
}
