import { cn } from "@giverve/ui";

import BaseHead from "./base-head";
import { fontPoppins } from "./fonts";

interface BaseLayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export default function BaseLayout({
  children,
  title,
  description,
}: Readonly<BaseLayoutProps>) {
  return (
    <>
      <BaseHead title={title} description={description} />
      <div
        className={cn(
          "min-h-[100dvh] bg-[#f0f0f0] font-sans antialiased",
          fontPoppins.className,
        )}
      >
        {children}
      </div>
    </>
  );
}
