import type { GetServerSideProps } from "next";

import type { User } from "~/utils/types";
import GuildList from "~/features/dashboard/components/guild-list";
import useAuth from "~/hooks/use-auth";
import BaseLayout from "~/layouts/base-layout";
import GlobalLoading from "~/layouts/global-loading";
import { checkIsLoggedInServerSide } from "~/utils/gssp";

export default function DashboardServerSlection({
  user,
}: Readonly<{ user: User }>) {
  const { isLoading: isUserLoading } = useAuth(user);
  if (isUserLoading) return <GlobalLoading />;

  return (
    <BaseLayout title="Dashboard | Server Selection">
      <main className="mx-auto max-w-5xl">
        <header className="pt-4 text-center">
          <h1 className="text-2xl font-bold">Select Server</h1>
        </header>
        <GuildList />
      </main>
    </BaseLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return await checkIsLoggedInServerSide({ req, res });
};
