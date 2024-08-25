import { Button } from "@giverve/ui/button";

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
        <div></div>
        <Button>Publish</Button>
      </div>
    </DashboardLayout>
  );
}
