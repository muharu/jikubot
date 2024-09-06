import type { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommandList } from "cmdk";
import { useForm } from "react-hook-form";
import { LuCheck, LuChevronsUpDown, LuLoader2 } from "react-icons/lu";

import { cn } from "@giverve/ui";
import { Button } from "@giverve/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@giverve/ui/command";
import { DialogFooter } from "@giverve/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@giverve/ui/form";
import { Input } from "@giverve/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@giverve/ui/popover";
import { Skeleton } from "@giverve/ui/skeleton";
import { eventInteraction } from "@giverve/validators";

import { useGetEmojis } from "~/features/dashboard/events/create/_hooks/use-get-emojis";
import { useMultiStepCreateEventFormStore } from "~/state/create-event-multiform-store";

export function EditEmojiForm({
  setIsDialogOpen,
  interactionId,
}: Readonly<{
  setIsDialogOpen: (value: boolean) => void;
  interactionId: string;
}>) {
  const { data: guildEmojis, isLoading } = useGetEmojis();
  const [open, setOpen] = useState(false);

  const interactionToEdit = useMultiStepCreateEventFormStore((state) =>
    state.formData.interactionsStep.find(
      (interaction) => interaction.id === interactionId,
    ),
  );

  const form = useForm<z.infer<typeof eventInteraction>>({
    resolver: zodResolver(eventInteraction),
    defaultValues: interactionToEdit ?? {
      id: "",
      name: "",
      limit: "50",
    },
  });

  const addInteraction = useMultiStepCreateEventFormStore(
    (state) => state.addInteraction,
  );
  const editInteraction = useMultiStepCreateEventFormStore(
    (state) => state.editInteraction,
  );

  const existingInteractions = useMultiStepCreateEventFormStore(
    (state) => state.formData.interactionsStep,
  );

  const onSubmit = (values: z.infer<typeof eventInteraction>) => {
    const isEditing = Boolean(interactionToEdit);
    const emojiAlreadyExists = existingInteractions.some(
      (interaction) =>
        interaction.id === values.id &&
        interaction.id !== interactionToEdit?.id,
    );

    if (emojiAlreadyExists) {
      form.setError("id", {
        type: "manual",
        message: "This emoji is already added.",
      });
      return;
    }

    if (isEditing) {
      editInteraction(values);
    } else {
      addInteraction(values);
    }

    setIsDialogOpen(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 font-bold"
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emojis</FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    {!isLoading ? (
                      <Button
                        variant="noShadow"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-white"
                      >
                        {field.value && (
                          <Image
                            width={20}
                            height={20}
                            alt="emoji"
                            src={`https://cdn.discordapp.com/emojis/${field.value}.webp`}
                            className="h-5 w-5"
                          />
                        )}
                        {field.value
                          ? guildEmojis?.find(
                              (emoji) => emoji.id === field.value,
                            )?.name
                            ? guildEmojis
                                .find((emoji) => emoji.id === field.value)
                                ?.name?.charAt(0)
                                .toUpperCase() +
                              (guildEmojis
                                .find((emoji) => emoji.id === field.value)
                                ?.name?.slice(1) ?? "")
                            : "Select Emoji"
                          : "Select Emoji"}

                        <LuChevronsUpDown
                          color="black"
                          className="ml-2 h-4 w-4 shrink-0"
                        />
                      </Button>
                    ) : (
                      <Skeleton className="flex h-10 w-full items-center bg-[#f0f0f0]">
                        <LuLoader2 className="ml-4 mr-2 h-5 w-5 animate-spin" />
                      </Skeleton>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-full !border-0 p-0 font-base">
                    <Command className="bg-white font-semibold">
                      <CommandList>
                        <CommandInput placeholder="Search emojis..." />
                        <CommandEmpty>No emoji found.</CommandEmpty>
                        <CommandGroup>
                          {guildEmojis?.map((emoji) => (
                            <CommandItem
                              key={emoji.id}
                              value={String(emoji.id)}
                              onSelect={() => {
                                field.onChange(emoji.id);
                                setOpen(false);
                              }}
                            >
                              <LuCheck
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === emoji.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <Image
                                width={20}
                                height={20}
                                src={`https://cdn.discordapp.com/emojis/${emoji.id}.webp`}
                                alt={emoji.name ?? ""}
                                className="mr-4 h-5 w-5"
                              />
                              {emoji.name
                                ? emoji.name.slice(0, 1).toUpperCase() +
                                  emoji.name.slice(1)
                                : ""}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>
                Select an emoji to be displayed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Name of the emoji to be displayed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limit</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Maximum participants allowed to interact with this emoji.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
