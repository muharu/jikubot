import Link from "next/link";
import { useRouter } from "next/router";
import { RiArrowLeftSLine } from "react-icons/ri";

import { cn } from "@giverve/ui";
import { Button, buttonVariants } from "@giverve/ui/button";

import { useMultiStepCreateEventFormStore } from "~/state/create-event-multiform-store";
import { trpc } from "~/utils/trpc";

export function EventEditTopbarMenu() {
  const router = useRouter();
  const guildId = String(router.query.guildId);

  const { mutate, isPending } = trpc.dashboard.event.createOne.useMutation();

  const formData = useMultiStepCreateEventFormStore((state) => state.formData);

  return (
    <div className="flex items-center justify-between">
      <Link
        href={`/dashboard/${guildId}/events`}
        className={cn(buttonVariants({ variant: "neutral" }), "rounded-full")}
      >
        <RiArrowLeftSLine className="size-5" />
        Back
      </Link>
      <Button
        disabled={isPending}
        onClick={() =>
          mutate({
            eventSetup: formData.setupEventStep,
            eventInteractions: formData.interactionsStep,
          })
        }
      >
        Publish
      </Button>
    </div>
  );
}
