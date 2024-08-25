import { api } from "~/utils/api";

export default function useLogin() {
  return api.dashboard.auth.login.useMutation();
}
