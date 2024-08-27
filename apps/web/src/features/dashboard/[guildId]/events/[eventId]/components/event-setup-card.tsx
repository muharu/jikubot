import dynamic from "next/dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@giverve/ui/card";

const BlurFade = dynamic(
  () => import("@giverve/ui/blur-fade").then((mod) => mod.BlurFade),
  {
    ssr: false,
  },
);

export default function EventCard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BlurFade className="w-full">
      <Card className="flex-1 bg-white">
        <CardHeader>
          <CardTitle>Event Setup</CardTitle>
          <CardDescription>
            Set up your event by filling in the details below
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </BlurFade>
  );
}
