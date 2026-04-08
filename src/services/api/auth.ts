import type { AuthSuccess, AuthUser } from "@/src/types/domain";
import { apiRequest } from "./client";

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  nickname: string;
};

export async function login(input: LoginInput): Promise<AuthSuccess> {
  return apiRequest<AuthSuccess>("/auth/login", {
    method: "POST",
    body: input
  });
}

export async function register(input: RegisterInput): Promise<AuthSuccess> {
  return apiRequest<AuthSuccess>("/auth/register", {
    method: "POST",
    body: input
  });
}

export async function refresh(refreshToken: string): Promise<AuthSuccess> {
  return apiRequest<AuthSuccess>("/auth/refresh", {
    method: "POST",
    body: { refreshToken }
  });
}

export async function getMe(accessToken: string): Promise<AuthUser> {
  const response = await apiRequest<{ user: AuthUser }>("/auth/me", {
    token: accessToken
  });

  return response.user;
}

export async function logout(params: { accessToken?: string | null; refreshToken?: string | null }): Promise<void> {
  await apiRequest<{ success: boolean }>("/auth/logout", {
    method: "POST",
    token: params.accessToken ?? undefined,
    body: params.refreshToken ? { refreshToken: params.refreshToken } : {}
  });
}
