import { trpc } from "~/utils/trpc";

export default function useLogin() {
  return trpc.dashboard.auth.login.useMutation();
}
