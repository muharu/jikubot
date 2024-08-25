import { api } from "~/utils/api";

export default function useLogout() {
  const utils = api.useUtils();
  return api.dashboard.auth.logout.useMutation({
    onSuccess: () => utils.invalidate(),
  });
}
