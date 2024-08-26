import Link from "next/link";
import {
  AiTwotoneBell,
  AiTwotoneEdit,
  AiTwotoneLike,
  AiTwotoneStop,
} from "react-icons/ai";
import { RiArrowLeftSLine } from "react-icons/ri";

import { cn } from "@giverve/ui";
import { Button, buttonVariants } from "@giverve/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@giverve/ui/card";
import { Input } from "@giverve/ui/input";

import useDashboardCheck from "~/hooks/use-dashboard-check";
import DashboardLayout from "~/layouts/dashboard-layout";
import GlobalLoading from "~/layouts/global-loading";

export default function EventPage() {
  const { isLoading, isInGuilds } = useDashboardCheck();

  if (isLoading || !isInGuilds) {
    return <GlobalLoading />;
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "neutral" }), "rounded-full")}
        >
          <RiArrowLeftSLine className="size-5" />
          Back
        </Link>
        <Button>Publish</Button>
      </div>

      <div className="mt-4 flex gap-x-4">
        <aside className="hidden min-w-52 flex-col gap-y-2.5 lg:flex">
          <Button
            variant="noShadow"
            className="h-10 w-full justify-start border text-lg font-bold"
          >
            <AiTwotoneEdit className="mr-1.5 size-7" />
            Event Setup
          </Button>

          <Button
            variant="default"
            className="h-10 w-full justify-start border bg-white text-lg"
          >
            <AiTwotoneLike className="mr-1.5 size-6" />
            Interactions
          </Button>

          <Button
            variant="default"
            className="h-10 w-full justify-start border bg-white text-lg"
          >
            <AiTwotoneStop className="mr-1.5 size-6" />
            Limits
          </Button>

          <Button
            variant="default"
            className="h-10 w-full justify-start border bg-white text-lg"
          >
            <AiTwotoneBell className="mr-1.5 size-6" />
            Notifications
          </Button>
        </aside>

        <Card className="flex-1 bg-white">
          <CardHeader>
            <CardTitle>Event Setup</CardTitle>
            <CardDescription>
              Set up your event by filling in the details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input placeholder="Event title" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
