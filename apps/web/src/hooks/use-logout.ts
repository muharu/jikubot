import { trpc } from "~/utils/trpc";

export default function useLogout() {
  const utils = trpc.useUtils();
  return trpc.dashboard.auth.logout.useMutation({
    onSuccess: () => utils.invalidate(),
  });
}
