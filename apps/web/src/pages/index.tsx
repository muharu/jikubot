import type { GetServerSideProps } from "next";

import BaseLayout from "~/layouts/base-layout";
import { checkHasLoggedInServerSide } from "~/utils/gssp";

export default function LandingPage() {
  return (
    <BaseLayout>
      <main></main>
    </BaseLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return await checkHasLoggedInServerSide({ req, res });
};
