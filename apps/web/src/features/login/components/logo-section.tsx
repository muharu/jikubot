import Image from "next/image";

export default function LogoSection() {
  return (
    <section className="grid gap-2 text-center">
      <Image
        src="/logo.png"
        width={128}
        height={128}
        alt="Jikubot Logo"
        className="pointer-events-none mx-auto size-32 select-none rounded-full"
        priority
      />
      <h1 className="text-4xl font-bold">Welcome Back!</h1>
      <p className="text-balance text-lg">
        Login to access your dashboard and manage your events.
      </p>
    </section>
  );
}
