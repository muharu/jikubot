import type { GetServerSideProps } from "next";
import Link from "next/link";

import { buttonVariants } from "@giverve/ui/button";
import { Card } from "@giverve/ui/card";

import BaseLayout from "~/layouts/base-layout";
import { checkHasLoggedInServerSide } from "~/utils/gssp";
import { LoginButton } from "../features/login/components/login-button";

export default function Login() {
  return (
    <BaseLayout title="Login">
      <main className="flex h-[100dvh] items-center justify-center">
        <Card className="mx-auto grid w-full max-w-sm gap-6 rounded-lg bg-white p-8 shadow-lg">
          <div className="grid gap-2 text-center">
            <h1 className="text-4xl font-bold">Welcome Back!</h1>
            <p className="text-balance text-lg">
              Login to access your dashboard and manage your events.
            </p>
          </div>
          <div className="grid gap-3">
            <LoginButton />
            <Link href="/" className={buttonVariants({ variant: "neutral" })}>
              Back to Home
            </Link>
          </div>
        </Card>
      </main>
    </BaseLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return await checkHasLoggedInServerSide({ req, res });
};
