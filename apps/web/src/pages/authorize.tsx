import type { GetServerSideProps } from "next";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { RiLoader3Fill } from "react-icons/ri";

import BaseLayout from "~/layouts/base-layout";
import { api } from "~/utils/api";
import { checkAuthorizeServerSide } from "~/utils/gssp";

export default function Authorization({
  code,
  state,
}: Readonly<{ code: string; state: string }>) {
  const router = useRouter();
  const hasRun = useRef(false);

  const { mutate } = api.auth.authorize.useMutation({
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

  return (
    <BaseLayout title="Authorization">
      <main className="flex h-screen items-center justify-center">
        <section className="flex flex-col items-center gap-y-2">
          <RiLoader3Fill className="h-16 w-16 animate-spin" />
          <span className="text-lg">Authenticating...</span>
        </section>
      </main>
    </BaseLayout>
  );
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
