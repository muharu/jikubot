import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { CommandList } from "cmdk";
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
import { Popover, PopoverContent, PopoverTrigger } from "@giverve/ui/popover";
import { Skeleton } from "@giverve/ui/skeleton";

import { trpc } from "~/utils/trpc";

export function GuildEmojisCombobox() {
  const { guildId } = useParams<{ guildId: string }>();
  const { data: guildEmojis, isLoading } =
    trpc.dashboard.guilds.getEmojis.useQuery({
      guildId,
    });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {!isLoading ? (
          <Button
            variant="noShadow"
            role="combobox"
            aria-expanded={open}
            className="bg-whitew-full justify-between"
          >
            {value && (
              <Image
                width={20}
                height={20}
                alt="emoji"
                src={`https://cdn.discordapp.com/emojis/${guildEmojis?.find((emoji) => emoji.name === value)?.id}.webp`}
                className="h-5 w-5"
              />
            )}
            {value
              ? guildEmojis?.find((emoji) => emoji.name === value)?.name
              : "Select Emojis"}
            <LuChevronsUpDown color="black" className="ml-2 h-4 w-4 shrink-0" />
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
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {guildEmojis?.map((emoji) => (
                <CommandItem
                  key={emoji.id}
                  value={String(emoji.name)}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <LuCheck
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === emoji.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <Image
                    width={20}
                    height={20}
                    src={`https://cdn.discordapp.com/emojis/${emoji.id}.webp`}
                    alt={emoji.name ?? ""}
                    className="mr-4 h-5 w-5"
                  />
                  {emoji.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
