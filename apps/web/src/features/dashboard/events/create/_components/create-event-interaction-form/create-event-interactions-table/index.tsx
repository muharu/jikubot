import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@giverve/ui/table";

import { useMultiStepCreateEventFormStore } from "~/state/create-event-multiform-store";
import { EditInteractionButton } from "./edit-interaction-button";
import { RemoveInteractionButton } from "./remove-interaction-button";

export function CreateEventInteractionsTable() {
  const interactionsStep = useMultiStepCreateEventFormStore(
    (state) => state.formData.interactionsStep,
  );

  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Emojis</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Limit</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {interactionsStep.map((interaction) => (
          <TableRow className="bg-white" key={String(interaction.id)}>
            <TableCell className="font-base">
              <Image
                width={20}
                height={20}
                src={`https://cdn.discordapp.com/emojis/${String(interaction.id)}.webp`}
                alt={interaction.name}
                className="h-7 w-7"
              />
            </TableCell>
            <TableCell>{interaction.name}</TableCell>
            <TableCell>{interaction.limit}</TableCell>
            <TableCell className="flex items-center justify-end gap-x-2">
              <EditInteractionButton interactionId={interaction.id} />
              <RemoveInteractionButton interactionId={interaction.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
