import Link from "next/link";
import { useRouter } from "next/router";
import {
  AiTwotoneBell,
  AiTwotoneEdit,
  AiTwotoneLike,
  AiTwotoneStop,
} from "react-icons/ai";

import { cn } from "@giverve/ui";
import { buttonVariants } from "@giverve/ui/button";

export default function EventEditSidebaMenu() {
  const router = useRouter();
  const guildId = String(router.query.guildId);
  const eventId = String(router.query.eventId);
  const lastPath = router.asPath.split("/").pop();

  return (
    <aside className="-mt-1 hidden min-w-52 flex-col gap-y-2.5 lg:flex">
      <Link
        href={`/dashboard/${guildId}/events/${eventId}`}
        className={cn(
          buttonVariants({
            variant: lastPath === eventId ? "noShadow" : "default",
          }),
          "h-10 w-full justify-start border text-lg font-bold",
          lastPath !== eventId ? "bg-white font-medium" : "",
        )}
      >
        <AiTwotoneEdit className="mr-1.5 size-7" />
        Event Setup
      </Link>

      <Link
        href={`/dashboard/${guildId}/events/${eventId}/interactions`}
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
      </Link>

      <Link
        href={`/dashboard/${guildId}/events/${eventId}/limits`}
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
      </Link>

      <Link
        href={`/dashboard/${guildId}/events/${eventId}/notifications`}
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
      </Link>
    </aside>
  );
}
