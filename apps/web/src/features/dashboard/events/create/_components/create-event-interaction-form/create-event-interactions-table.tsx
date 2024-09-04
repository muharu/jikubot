import Image from "next/image";
import { AiTwotoneDelete } from "react-icons/ai";

import { Button } from "@giverve/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@giverve/ui/table";

import { useMultiStepCreateEventFormStore } from "~/state/create-event-multiform-store";

export function CreateEventInteractionsTable() {
  const interactionsStep = useMultiStepCreateEventFormStore(
    (state) => state.formData.interactionsStep,
  );

  const removeInteraction = useMultiStepCreateEventFormStore(
    (state) => state.removeInteraction,
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
            <TableCell className="text-right">
              <Button
                onClick={() => removeInteraction(interaction.id)}
                size="icon"
                variant="reverse"
              >
                <AiTwotoneDelete className="size-5" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
