import Link from "next/link";
import { useRouter } from "next/router";
import { AiTwotoneDashboard } from "react-icons/ai";

import { cn } from "@giverve/ui";
import { buttonVariants } from "@giverve/ui/button";
import { ScrollArea } from "@giverve/ui/scroll-area";

import useGetGuilds from "~/hooks/use-get-guilds";
import BaseLayout from "./base-layout";

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
          <main className="flex-1 overflow-auto bg-bg p-4">{children}</main>
        </div>
      </div>
    </BaseLayout>
  );
}

function Sidebar() {
  const router = useRouter();
  const guildId = String(router.query.guildId);

  return (
    <ScrollArea className="hidden h-[100dvh] w-[350px] rounded-md border-r bg-white p-4 lg:flex">
      <nav className="flex flex-col gap-y-2">
        <Link
          href={`/dashboard/${guildId}`}
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-[95%] justify-start",
          )}
        >
          <AiTwotoneDashboard className="mr-2 size-7" />
          Dashboard
        </Link>
      </nav>
    </ScrollArea>
  );
}
