import type { GetServerSideProps } from "next";

import BaseLayout from "~/layouts/base-layout";
import { checkIsLoggedInServerSide } from "~/utils/gssp";

export default function Home() {
  return (
    <BaseLayout>
      <main></main>
    </BaseLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return await checkIsLoggedInServerSide({ req, res });
};
