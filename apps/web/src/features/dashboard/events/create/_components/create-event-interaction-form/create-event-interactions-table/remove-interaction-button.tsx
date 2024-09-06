import { AiTwotoneDelete } from "react-icons/ai";

import { Button } from "@giverve/ui/button";

import { useMultiStepCreateEventFormStore } from "~/state/create-event-multiform-store";

interface IRemoveInteractionButtonProps {
  interactionId: string;
}

export function RemoveInteractionButton({
  interactionId,
}: Readonly<IRemoveInteractionButtonProps>) {
  const removeInteraction = useMultiStepCreateEventFormStore(
    (state) => state.removeInteraction,
  );

  return (
    <Button
      onClick={() => removeInteraction(interactionId)}
      size="icon"
      variant="reverse"
    >
      <AiTwotoneDelete className="size-5" />
    </Button>
  );
}
