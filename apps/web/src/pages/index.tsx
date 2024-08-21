import useAuth from "~/hooks/use-auth";
import BaseLayout from "~/layouts/base-layout";

export default function Home() {
  const { data: user, isLoading: isUserLoading } = useAuth();

  if (isUserLoading) return <div>Loading...</div>;

  return (
    <BaseLayout>
      <main>{JSON.stringify(user)}</main>
    </BaseLayout>
  );
}
