import type { GetServerSideProps } from "next";

import LogoSection from "~/features/login/components/logo-section";
import BaseLayout from "~/layouts/base-layout";
import { checkHasLoggedInServerSide } from "~/utils/gssp";
import { LoginButton } from "../features/login/components/login-button";

export default function Login() {
  return (
    <BaseLayout title="Login">
      <main className="flex h-[100dvh] items-center justify-center">
        <div className="mx-auto grid w-full max-w-sm gap-6 rounded-lg p-8 shadow-lg">
          <LogoSection />
          <div className="grid gap-4">
            <LoginButton />
          </div>
        </div>
      </main>
    </BaseLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return await checkHasLoggedInServerSide({ req, res });
};
