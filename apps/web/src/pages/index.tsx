import { RiLoader3Fill } from "react-icons/ri";

import { Button } from "@giverve/ui/button";

import useAuth from "~/hooks/use-auth";
import useLogout from "~/hooks/use-logout";
import BaseLayout from "~/layouts/base-layout";

export default function Home() {
  const { data: user, isLoading: isUserLoading } = useAuth();
  const { mutate: logout, isPending: pendingLogout } = useLogout();

  if (isUserLoading) return <div>Loading...</div>;

  return (
    <BaseLayout>
      <main>
        {JSON.stringify(user)}
        <br />
        <Button onClick={() => logout()} disabled={pendingLogout}>
          {!pendingLogout ? (
            "Logout"
          ) : (
            <RiLoader3Fill className="size-7 animate-spin" />
          )}
        </Button>
      </main>
    </BaseLayout>
  );
}
