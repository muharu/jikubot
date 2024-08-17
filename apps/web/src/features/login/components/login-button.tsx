import { RiLoader3Fill } from "react-icons/ri";
import { SiDiscord } from "react-icons/si";

import { Button } from "@giverve/ui/button";

import useLogin from "../hooks/use-login";

export function LoginButton() {
  const { mutate, data, isPending } = useLogin();
  if (data) window.location.href = data.url;

  return (
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
  );
}
