import { RiLoader3Fill } from "react-icons/ri";

import BaseLayout from "./base-layout";

export default function GlobalLoading({
  message,
}: Readonly<{ message?: string }>) {
  return (
    <BaseLayout title={message ?? "Loading..."}>
      <main className="flex h-screen items-center justify-center">
        <section className="flex flex-col items-center gap-y-2">
          <RiLoader3Fill className="h-16 w-16 animate-spin" />
          <span className="text-lg">{message ?? "Loading..."}</span>
        </section>
      </main>
    </BaseLayout>
  );
}
