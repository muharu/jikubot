import type { GetServerSideProps } from "next";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

import GlobalLoading from "~/layouts/global-loading";
import { checkAuthorizeServerSide } from "~/utils/gssp";
import { trpc } from "~/utils/trpc";

export default function Authorization({
  code,
  state,
}: Readonly<{ code: string; state: string }>) {
  const router = useRouter();
  const hasRun = useRef(false);

  const { mutate } = trpc.dashboard.auth.authorize.useMutation({
    onSuccess: () => {
      void router.replace("/");
    },
    onError: () => {
      void router.replace("/login");
    },
  });

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      mutate({ code, state });
    }
  }, [code, state, mutate]);

  return <GlobalLoading message="Authenticating..." />;
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  return await checkAuthorizeServerSide({
    req,
    query,
  });
};
