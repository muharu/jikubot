import BaseLayout from "./base-layout";

export default function GlobalLoading({
  message,
}: Readonly<{ message?: string }>) {
  return (
    <BaseLayout title={message ?? "Loading..."}>
      <main className="flex h-screen items-center justify-center">
        <section className="flex flex-col items-center gap-y-2">
          <span className="animate-bounce text-8xl">💩</span>
        </section>
      </main>
    </BaseLayout>
  );
}
