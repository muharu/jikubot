import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddLine } from "react-icons/ri";

import { cn } from "@giverve/ui";
import { buttonVariants } from "@giverve/ui/button";

export function CreateEventButtonBigScreen() {
  const pathname = usePathname();
  return (
    <Link
      href={`${pathname}/create`}
      className={cn(buttonVariants(), "hidden lg:flex")}
    >
      <RiAddLine className="mr-1.5 size-5" />
      New
    </Link>
  );
}

export function CreateEventButtonSmallScreen() {
  const pathname = usePathname();
  return (
    <Link
      href={`${pathname}/create`}
      className={cn(
        buttonVariants({ size: "icon", variant: "noShadow" }),
        "absolute bottom-10 right-5 h-14 w-14 rounded-full lg:hidden",
      )}
    >
      <RiAddLine className="size-8" />
    </Link>
  );
}
