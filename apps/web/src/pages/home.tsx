import Link from "next/link";

import { buttonVariants } from "@giverve/ui/button";

import useAuth from "~/hooks/use-auth";
import BaseLayout from "~/layouts/base-layout";
import GlobalLoading from "~/layouts/global-loading";

export default function Home() {
  const { isLoading: isUserLoading } = useAuth();
  if (isUserLoading) return <GlobalLoading />;

  return (
    <BaseLayout title="Home">
      <main>
        <div className="flex h-screen items-center justify-center">
          <Link href="/dashboard" className={buttonVariants()}>
            Manage Your Server
          </Link>
        </div>
      </main>
    </BaseLayout>
  );
}
