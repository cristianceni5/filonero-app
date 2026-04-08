import { useAuthSessionContext } from "@/src/providers/AuthSessionProvider";

export function useAuthSession() {
  return useAuthSessionContext();
}
