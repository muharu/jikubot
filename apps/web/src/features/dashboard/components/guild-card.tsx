import Image from "next/image";
import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";

import { cn } from "@giverve/ui";
import { buttonVariants } from "@giverve/ui/button";

import type { CardContentProps, GuildCardProps } from "../types";
import { env } from "~/env";

export default function GuildCard({
  id,
  name,
  icon,
  isJoined,
}: Readonly<GuildCardProps>) {
  return (
    <section className="flex flex-col">
      <div key={id} className="relative overflow-hidden rounded-lg">
        <BackgroundImage id={id} icon={icon} name={name} isJoined={isJoined} />
        <RoundedIcon id={id} icon={icon} name={name} isJoined={isJoined} />
      </div>
      <CardContent id={id} name={name} isJoined={isJoined} />
    </section>
  );
}

function BackgroundImage({ id, icon, name }: Readonly<GuildCardProps>) {
  return (
    <>
      {icon ? (
        <Image
          src={`https://cdn.discordapp.com/icons/${id}/${icon}.png`}
          width={256}
          height={256}
          alt={name}
          className="h-36 w-full select-none border-2 border-foreground object-cover shadow-xl blur-xl"
          priority
        />
      ) : (
        <div className="h-36 w-full select-none bg-muted blur-xl" />
      )}
    </>
  );
}

function RoundedIcon({ id, icon, name }: Readonly<GuildCardProps>) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {icon ? (
        <Image
          src={`https://cdn.discordapp.com/icons/${id}/${icon}.webp`}
          width={96}
          height={96}
          alt={name}
          className="h-24 w-24 select-none rounded-full border-2 border-muted bg-background object-cover"
          priority
        />
      ) : (
        <div className="h-24 w-24 select-none rounded-full border-2 border-muted bg-background">
          <div className="flex h-full items-center justify-center text-3xl font-extrabold">
            {name[0]}
          </div>
        </div>
      )}
    </div>
  );
}

function CardContent({ id, name, isJoined }: Readonly<CardContentProps>) {
  return (
    <div className="flex items-center justify-between pt-2.5">
      <h2 className="line-clamp-1 text-lg font-semibold">{name}</h2>
      {isJoined ? (
        <Link
          href={`/dashboard/${id}`}
          className={cn(
            buttonVariants({ variant: "primary" }),
            "font-semibold",
          )}
        >
          Manage
        </Link>
      ) : (
        <ButtonInvite id={id} />
      )}
    </div>
  );
}

function ButtonInvite({ id }: Readonly<{ id: string }>) {
  const inviteParams = new URLSearchParams({
    scope: "bot applications.commands",
    response_type: "code",
    redirect_uri: `${env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    permissions: "364870364415",
    client_id: env.NEXT_PUBLIC_AUTH_DISCORD_ID,
    guild_id: id,
  });
  return (
    <a
      href={`https://discord.com/oauth2/authorize?${inviteParams.toString()}`}
      className={cn(buttonVariants({ variant: "secondary" }), "font-semibold")}
    >
      Invite
      <LuExternalLink className="ml-1.5 size-4" />
    </a>
  );
}
