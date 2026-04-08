import type { AuthUser } from "@/src/types/domain";
import { apiRequest } from "./client";

export async function updateMe(accessToken: string, nickname: string): Promise<AuthUser> {
  const response = await apiRequest<{ user: AuthUser }>("/users/me", {
    method: "PATCH",
    token: accessToken,
    body: { nickname }
  });

  return response.user;
}

export async function searchUsers(
  accessToken: string,
  query: string
): Promise<{ id: string; nickname: string; status: string }[]> {
  const response = await apiRequest<{ users: { id: string; nickname: string; status: string }[] }>(
    `/users/search?q=${encodeURIComponent(query)}`,
    { token: accessToken }
  );

  return response.users;
}
