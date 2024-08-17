import Image from "next/image";
import { SiDiscord } from "react-icons/si";

import { Button } from "@giverve/ui/button";

import logo from "~/assets/logo.png";
import BaseLayout from "~/layouts/base-layout";

export default function Login() {
  return (
    <BaseLayout title="Login">
      <main className="flex h-[100dvh] items-center justify-center">
        <section className="mx-auto grid w-full max-w-md gap-6 rounded-lg p-8 shadow-lg">
          <div className="grid gap-2 text-center">
            <Image
              src={logo}
              alt="Jikubot Logo"
              className="mx-auto size-36 rounded-full"
              priority
            />
            <h1 className="text-4xl font-bold">Welcome Back!</h1>
            <p className="text-balance text-lg">
              Login to access your dashboard and manage your events.
            </p>
          </div>
          <div className="grid gap-4">
            <Button className="font-medium">
              <SiDiscord className="mr-2 size-5" />
              Login with Discord
            </Button>
          </div>
        </section>
      </main>
    </BaseLayout>
  );
}
