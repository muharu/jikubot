import useAuth from "~/hooks/use-auth";
import useGetGuild from "~/hooks/use-get-guild";
import DashboardLayout from "~/layouts/dashboard-layout";
import GlobalLoading from "~/layouts/global-loading";

export default function Dashboard() {
  const { isLoading: isUserLoading } = useAuth();
  const { isLoading: isGuildsLoading } = useGetGuild();

  if (isUserLoading || isGuildsLoading) {
    return <GlobalLoading />;
  }

  return (
    <DashboardLayout>
      <main>
        <h1 className="text-2xl">Dashboard</h1>
      </main>
    </DashboardLayout>
  );
}
