import type { GetServerSideProps } from "next";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

import GlobalLoading from "~/layouts/global-loading";
import { api } from "~/utils/api";
import { checkAuthorizeServerSide } from "~/utils/gssp";

export default function Authorization({
  code,
  state,
}: Readonly<{ code: string; state: string }>) {
  const router = useRouter();
  const hasRun = useRef(false);

  const { mutate } = api.dashboard.auth.authorize.useMutation({
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
