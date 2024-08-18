import type { GetServerSideProps } from "next";
import { useEffect, useRef } from "react";
import { RiLoader3Fill } from "react-icons/ri";

import BaseLayout from "~/layouts/base-layout";
import { api } from "~/utils/api";
import { authorizeServerSide } from "~/utils/gssp";

export default function Authorization({
  code,
  state,
}: Readonly<{ code: string; state: string }>) {
  const { mutate } = api.auth.authorize.useMutation();
  const hasRun = useRef(false);

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
  return await authorizeServerSide({
    req,
    query,
  });
};
