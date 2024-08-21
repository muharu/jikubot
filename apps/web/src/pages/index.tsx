import type { GetServerSideProps } from "next";
import { RiLoader3Fill } from "react-icons/ri";

import { Button } from "@giverve/ui/button";

import useAuth from "~/hooks/use-auth";
import useLogout from "~/hooks/use-logout";
import BaseLayout from "~/layouts/base-layout";
import GlobalLoading from "~/layouts/global-loading";
import { checkIsLoggedInServerSide } from "~/utils/gssp";

export default function Home() {
  const { data: user, isLoading: isUserLoading } = useAuth();
  const { mutate: logout, isPending: pendingLogout } = useLogout();

  if (isUserLoading) return <GlobalLoading />;

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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return await checkIsLoggedInServerSide({
    req,
    res,
  });
};
