import { api } from "~/utils/api";

export default function useLogin() {
  return api.auth.login.useMutation();
}
