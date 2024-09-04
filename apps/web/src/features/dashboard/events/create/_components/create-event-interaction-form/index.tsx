import { Button } from "@giverve/ui/button";

import { useMultiStepCreateEventFormStore } from "~/state/create-event-multiform-store";
import { EmojiDialog } from "./add-emoji-dialog";
import { CreateEventInteractionsTable } from "./create-event-interactions-table";
import { EmojisPresetSelect } from "./emoji-preset-select";

export function CreateEventInteractionForm() {
  const previousStep = useMultiStepCreateEventFormStore(
    (state) => state.previousStep,
  );

  const nextStep = useMultiStepCreateEventFormStore((state) => state.nextStep);

  return (
    <main>
      <div className="flex items-center justify-between">
        <EmojisPresetSelect />
        <EmojiDialog />
      </div>

      <CreateEventInteractionsTable />

      <div className="mt-8 flex items-center justify-between">
        <Button onClick={previousStep}>Back</Button>
        <Button onClick={nextStep}>Next</Button>
      </div>
    </main>
  );
}
