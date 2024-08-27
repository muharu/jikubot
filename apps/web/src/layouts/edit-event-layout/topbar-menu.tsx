import Link from "next/link";
import { useRouter } from "next/router";
import { LuLoader2 } from "react-icons/lu";
import { RiArrowLeftSLine } from "react-icons/ri";

import { cn } from "@giverve/ui";
import { Button, buttonVariants } from "@giverve/ui/button";

import { useAutoSave } from "~/context/autosave-context";

export default function EventEditTopbarMenu() {
  const router = useRouter();
  const guildId = String(router.query.guildId);

  const { autoSaving } = useAutoSave();

  return (
    <div className="flex items-center justify-between">
      <Link
        href={`/dashboard/${guildId}/events`}
        className={cn(buttonVariants({ variant: "neutral" }), "rounded-full")}
      >
        <RiArrowLeftSLine className="size-5" />
        Back
      </Link>
      <Button disabled={autoSaving}>
        {autoSaving ? (
          <>
            <LuLoader2 className="mr-1.5 size-5 animate-spin" />
            Saving...
          </>
        ) : (
          "Publish"
        )}
      </Button>
    </div>
  );
}
