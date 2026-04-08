import type { AuthUser, SessionPayload, SessionTokens } from "@/src/types/domain";
import { clearPersistedSession, getPersistedSession, savePersistedSession } from "./tokenStore";

export async function loadSessionFromStorage(): Promise<{
  tokens: SessionTokens;
  user: AuthUser | null;
} | null> {
  return getPersistedSession();
}

export async function persistSession(session: {
  session: SessionPayload | SessionTokens;
  user: AuthUser | null;
}): Promise<void> {
  await savePersistedSession({
    tokens: {
      accessToken: session.session.accessToken,
      refreshToken: session.session.refreshToken
    },
    user: session.user
  });
}

export async function clearSessionStorage(): Promise<void> {
  await clearPersistedSession();
}
