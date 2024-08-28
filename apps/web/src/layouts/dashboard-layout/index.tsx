import Link from "next/link";
import { useRouter } from "next/router";
import {
  AiTwotoneCalendar,
  AiTwotoneDashboard,
  AiTwotoneSmile,
} from "react-icons/ai";

import { cn } from "@giverve/ui";
import { buttonVariants } from "@giverve/ui/button";
import { ScrollArea } from "@giverve/ui/scroll-area";

import useGetGuild from "~/hooks/use-get-guild";
import BaseLayout from "../base-layout";
import GuildCard from "./guild-card";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = useGetGuild();

  return (
    <BaseLayout title={`${data?.name} | Dashboard`}>
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
          prefetch={false}
          href={`/dashboard/${guildId}`}
          className={cn(
            buttonVariants({
              variant: isActive("/") ? "noShadow" : "neutral",
            }),
            "w-[95%] justify-start font-semibold",
            isActive("/") && "font-bold",
          )}
        >
          <AiTwotoneDashboard className="mr-2 h-6 w-6" />
          Dashboard
        </Link>

        <Link
          prefetch={false}
          href={`/dashboard/${guildId}/events`}
          className={cn(
            buttonVariants({
              variant: isActive("/events") ? "noShadow" : "neutral",
            }),
            "w-[95%] justify-start font-semibold",
            isActive("/events") && "font-bold",
          )}
        >
          <AiTwotoneCalendar className="mr-2 h-6 w-6" />
          Events
        </Link>

        <Link
          prefetch={false}
          href={`/dashboard/${guildId}/lfg`}
          className={cn(
            buttonVariants({
              variant: isActive("/lfg") ? "noShadow" : "neutral",
            }),
            "w-[95%] justify-start font-semibold",
            isActive("/lfg") && "font-bold",
          )}
        >
          <AiTwotoneSmile className="mr-2 h-6 w-6" />
          Looking for Group
        </Link>
      </nav>
    </ScrollArea>
  );
}
