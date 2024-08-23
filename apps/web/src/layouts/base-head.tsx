import Head from "next/head";

interface BaseHeadProps {
  title?: string;
  description?: string;
}

export default function BaseHead({
  title,
  description,
}: Readonly<BaseHeadProps>) {
  return (
    <Head>
      <title>{title ?? "Jikubot"}</title>
      <meta name="description" content={description ?? "Jikubot Discord bot"} />
    </Head>
  );
}
