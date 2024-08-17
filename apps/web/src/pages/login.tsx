import Image from "next/image";
import { RiLoader3Fill } from "react-icons/ri";
import { SiDiscord } from "react-icons/si";

import { Button } from "@giverve/ui/button";

import logo from "~/assets/logo.png";
import BaseLayout from "~/layouts/base-layout";
import { api } from "~/utils/api";

export default function Login() {
  const { mutate, data, isPending } = api.auth.login.useMutation();

  if (data) window.location.href = data.url;

  return (
    <BaseLayout title="Login">
      <main className="flex h-[100dvh] items-center justify-center">
        <section className="mx-auto grid w-full max-w-sm gap-6 rounded-lg p-8 shadow-lg">
          <div className="grid gap-2 text-center">
            <Image
              src={logo}
              alt="Jikubot Logo"
              className="pointer-events-none mx-auto size-32 select-none rounded-full"
              priority
            />
            <h1 className="text-4xl font-bold">Welcome Back!</h1>
            <p className="text-balance text-lg">
              Login to access your dashboard and manage your events.
            </p>
          </div>
          <div className="grid gap-4">
            <Button
              onClick={() => mutate()}
              disabled={isPending}
              className="font-semibold"
            >
              {!isPending ? (
                <>
                  <SiDiscord className="mr-2 size-5" />
                  Login with Discord
                </>
              ) : (
                <RiLoader3Fill className="size-7 animate-spin" />
              )}
            </Button>
          </div>
        </section>
      </main>
    </BaseLayout>
  );
}
