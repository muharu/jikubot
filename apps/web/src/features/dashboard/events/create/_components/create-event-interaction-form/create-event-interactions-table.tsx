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
        </TableRow>
      </TableHeader>
      <TableBody>
        {interactionsStep.map((interaction) => (
          <TableRow className="bg-white" key={interaction.emoji}>
            <TableCell className="font-base">
              <Image
                width={20}
                height={20}
                src={`https://cdn.discordapp.com/emojis/${interaction.emoji}.webp`}
                alt={interaction.name}
                className="h-7 w-7"
              />
            </TableCell>
            <TableCell>{interaction.name}</TableCell>
            <TableCell>{interaction.limit}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
