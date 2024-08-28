import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiTwotoneHome } from "react-icons/ai";

import { cn } from "@giverve/ui";
import { buttonVariants } from "@giverve/ui/button";
import { Card } from "@giverve/ui/card";

import useGetGuild from "~/hooks/use-get-guild";

export default function GuildCard() {
  const router = useRouter();
  const guildId = String(router.query.guildId);
  const { data: guild } = useGetGuild();

  return (
    <Card className="mb-5 w-[95%] bg-[#f0f0f0] p-3">
      <div className="flex items-center justify-center gap-x-2">
        <Image
          src={`https://cdn.discordapp.com/icons/${guildId}/${guild?.icon}.webp`}
          className="rounded-full"
          width={40}
          height={40}
          alt="guild logo"
        />
        <span>{guild?.name}</span>
      </div>

      <div className="mt-2 flex items-center gap-x-2">
        <Link
          prefetch={false}
          href="/home"
          className={cn(
            buttonVariants({ variant: "reverse", size: "icon" }),
            "w-fit bg-white px-2 text-black",
          )}
        >
          <AiTwotoneHome className="size-6" />
        </Link>
        <Link
          prefetch={false}
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "reverse", size: "sm" }),
            "w-full bg-secondary text-white",
          )}
        >
          Change Server
        </Link>
      </div>
    </Card>
  );
}
