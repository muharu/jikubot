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

export function CreateEventCard({
  children,
  title,
  description,
}: Readonly<{
  children: React.ReactNode;
  title: string;
  description: string;
}>) {
  return (
    <BlurFade className="w-full">
      <Card className="flex-1 bg-white">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </BlurFade>
  );
}
