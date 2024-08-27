import { useRouter } from "next/router";
import {
  AiTwotoneBell,
  AiTwotoneEdit,
  AiTwotoneLike,
  AiTwotoneStop,
} from "react-icons/ai";

import { cn } from "@giverve/ui";
import { Button, buttonVariants } from "@giverve/ui/button";

export default function EventEditSidebarMenu() {
  const router = useRouter();
  const guildId = String(router.query.guildId);
  const eventId = String(router.query.eventId);
  const lastPath = router.asPath.split("/").pop();

  return (
    <aside className="-mt-1 hidden min-w-52 flex-col gap-y-2.5 lg:flex">
      <Button
        onClick={() => router.push(`/dashboard/${guildId}/events/${eventId}`)}
        variant={lastPath === eventId ? "noShadow" : "default"}
        className={cn(
          "h-10 w-full justify-start border text-lg font-bold",
          lastPath !== eventId ? "bg-white font-medium" : "",
        )}
      >
        <AiTwotoneEdit className="mr-1.5 size-7" />
        Event Setup
      </Button>

      <Button
        onClick={() =>
          router.push(`/dashboard/${guildId}/events/${eventId}/interactions`)
        }
        variant={lastPath === "interactions" ? "noShadow" : "default"}
        className={cn(
          buttonVariants({
            variant: lastPath === "interactions" ? "noShadow" : "default",
          }),
          "h-10 w-full justify-start border text-lg font-bold",
          lastPath !== "interactions" ? "bg-white font-medium" : "",
        )}
      >
        <AiTwotoneLike className="mr-1.5 size-6" />
        Interactions
      </Button>

      <Button
        disabled
        onClick={() =>
          router.push(`/dashboard/${guildId}/events/${eventId}/limits`)
        }
        variant={lastPath === "limits" ? "noShadow" : "default"}
        className={cn(
          buttonVariants({
            variant: lastPath === "limits" ? "noShadow" : "default",
          }),
          "h-10 w-full justify-start border text-lg font-bold",
          lastPath !== "limits" ? "bg-white font-medium" : "",
        )}
      >
        <AiTwotoneStop className="mr-1.5 size-6" />
        Limits
      </Button>

      <Button
        disabled
        onClick={() =>
          router.push(`/dashboard/${guildId}/events/${eventId}/notifications`)
        }
        variant={lastPath === "notifications" ? "noShadow" : "default"}
        className={cn(
          buttonVariants({
            variant: lastPath === "notifications" ? "noShadow" : "default",
          }),
          "h-10 w-full justify-start border text-lg font-bold",
          lastPath !== "notifications" ? "bg-white font-medium" : "",
        )}
      >
        <AiTwotoneBell className="mr-1.5 size-6" />
        Notifications
      </Button>
    </aside>
  );
}
