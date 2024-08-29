import { GuildList } from "~/features/dashboard/_components/guild-list";
import useAuth from "~/hooks/use-auth";
import BaseLayout from "~/layouts/base-layout";
import GlobalLoading from "~/layouts/global-loading";

export default function DashboardServerSlection() {
  const { isLoading: isUserLoading } = useAuth();
  if (isUserLoading) return <GlobalLoading />;

  return (
    <BaseLayout title="Dashboard | Server Selection">
      <main className="mx-auto max-w-5xl">
        <div className="pt-4 text-center">
          <h1 className="text-2xl font-bold">Select Server</h1>
        </div>
        <GuildList />
      </main>
    </BaseLayout>
  );
}
