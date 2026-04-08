import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { AuthUser, SessionTokens } from "@/src/types/domain";

const SESSION_STORAGE_KEY = "filonero.session.v1";

export type PersistedSession = {
  tokens: SessionTokens;
  user: AuthUser | null;
};

function canUseWebStorage(): boolean {
  return Platform.OS === "web" && typeof window !== "undefined" && !!window.localStorage;
}

export async function savePersistedSession(session: PersistedSession): Promise<void> {
  const serialized = JSON.stringify(session);

  if (canUseWebStorage()) {
    window.localStorage.setItem(SESSION_STORAGE_KEY, serialized);
    return;
  }

  await SecureStore.setItemAsync(SESSION_STORAGE_KEY, serialized);
}

export async function getPersistedSession(): Promise<PersistedSession | null> {
  let raw: string | null = null;

  if (canUseWebStorage()) {
    raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  } else {
    raw = await SecureStore.getItemAsync(SESSION_STORAGE_KEY);
  }

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PersistedSession;
  } catch {
    return null;
  }
}

export async function clearPersistedSession(): Promise<void> {
  if (canUseWebStorage()) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
}
