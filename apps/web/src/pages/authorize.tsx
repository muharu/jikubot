import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { RiLoader3Fill } from "react-icons/ri";

import BaseLayout from "~/layouts/base-layout";
import { authorizeServerSide } from "~/utils/gssp";

export default function Authorization({
  code,
  state,
}: Readonly<{ code: string; state: string }>) {
  const { replace } = useRouter();

  if (!code || !state) {
    void replace("/login");
  } else {
    console.log("Code:", code, "State:", state);
  }

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
