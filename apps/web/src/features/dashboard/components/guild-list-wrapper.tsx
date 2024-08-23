export default function GuildListWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="mx-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-4 md:max-w-5xl md:grid-cols-3 lg:mx-auto lg:mt-6">
      {children}
    </section>
  );
}
