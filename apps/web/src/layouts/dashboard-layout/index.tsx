import Link from "next/link";
import { useRouter } from "next/router";
import { AiTwotoneDashboard } from "react-icons/ai";
import { BsCalendar2Week } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi2";

import { cn } from "@giverve/ui";
import { buttonVariants } from "@giverve/ui/button";
import { ScrollArea } from "@giverve/ui/scroll-area";

import useGetGuilds from "~/hooks/use-get-guilds";
import BaseLayout from "../base-layout";
import GuildCard from "./guild-card";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const guildId = String(router.query.guildId);
  const { data } = useGetGuilds();
  const currentGuild = data?.find((guild) => guild.id === guildId);

  return (
    <BaseLayout title={`${currentGuild?.name} | Dashboard`}>
      <div className="flex h-[100dvh]">
        <Sidebar />
        <div className="flex h-full w-full flex-col">
          <main className="flex-1 overflow-auto bg-[#f0f0f0] p-4">
            {children}
          </main>
        </div>
      </div>
    </BaseLayout>
  );
}

function Sidebar() {
  const router = useRouter();
  const guildId = String(router.query.guildId);

  const isActive = (path: string) => {
    const basePath = `/dashboard/${guildId}`;
    if (path === "/") {
      // Only return true if the path is exactly the basePath
      return router.asPath === basePath;
    }
    // For other paths, ensure it starts with the basePath and the specific path
    return router.asPath.startsWith(`${basePath}${path}`);
  };

  return (
    <ScrollArea className="hidden h-[100dvh] w-[350px] rounded-md border-r bg-white p-4 lg:flex">
      <GuildCard />

      <nav className="mt-4 flex flex-col gap-y-3">
        <Link
          href={`/dashboard/${guildId}`}
          className={cn(
            buttonVariants({
              variant: isActive("/") ? "noShadow" : "neutral",
            }),
            "w-[95%] justify-start font-semibold",
          )}
        >
          <AiTwotoneDashboard className="mr-2 h-6 w-6" />
          Dashboard
        </Link>

        <Link
          href={`/dashboard/${guildId}/events`}
          className={cn(
            buttonVariants({
              variant: isActive("/events") ? "noShadow" : "neutral",
            }),
            "w-[95%] justify-start font-semibold",
          )}
        >
          <BsCalendar2Week className="mr-2 h-6 w-6" />
          Events
        </Link>

        <Link
          href={`/dashboard/${guildId}/lfg`}
          className={cn(
            buttonVariants({
              variant: isActive("/lfg") ? "noShadow" : "neutral",
            }),
            "w-[95%] justify-start font-semibold",
          )}
        >
          <HiUserGroup className="mr-2 h-6 w-6" />
          Looking for Group
        </Link>
      </nav>
    </ScrollArea>
  );
}
