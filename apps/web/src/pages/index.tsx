import useAuth from "~/hooks/use-auth";
import BaseLayout from "~/layouts/base-layout";
import GlobalLoading from "~/layouts/global-loading";

export default function Home() {
  const { isLoading: isUserLoading } = useAuth();
  if (isUserLoading) return <GlobalLoading />;

  return (
    <BaseLayout>
      <main></main>
    </BaseLayout>
  );
}
