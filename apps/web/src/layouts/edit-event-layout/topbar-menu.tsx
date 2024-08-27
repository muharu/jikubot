import Link from "next/link";
import { useRouter } from "next/router";
import { RiArrowLeftSLine } from "react-icons/ri";

import { cn } from "@giverve/ui";
import { Button, buttonVariants } from "@giverve/ui/button";

export default function EventEditTopbarMenu() {
  const router = useRouter();
  const guildId = String(router.query.guildId);

  return (
    <div className="flex items-center justify-between">
      <Link
        href={`/dashboard/${guildId}/events`}
        className={cn(buttonVariants({ variant: "neutral" }), "rounded-full")}
      >
        <RiArrowLeftSLine className="size-5" />
        Back
      </Link>
      <Button>Publish</Button>
    </div>
  );
}
