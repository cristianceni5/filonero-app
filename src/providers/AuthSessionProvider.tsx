import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getMe, login, logout, refresh, register } from "@/src/services/api/auth";
import { clearSessionStorage, loadSessionFromStorage, persistSession } from "@/src/services/session/sessionManager";
import type { ApiClientError } from "@/src/services/api/client";
import type { AuthSuccess, AuthUser, SessionTokens } from "@/src/types/domain";

type AuthState =
  | { status: "hydrating"; user: null; tokens: null }
  | { status: "signedOut"; user: null; tokens: null }
  | { status: "signedIn"; user: AuthUser; tokens: SessionTokens };

type AuthSessionContextValue = {
  isHydrating: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signUp: (input: { email: string; password: string; nickname: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  reloadMe: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | undefined>(undefined);

function isUnauthorized(error: unknown): boolean {
  return typeof error === "object" && error !== null && "statusCode" in error && (error as ApiClientError).statusCode === 401;
}

function toSignedIn(result: AuthSuccess): AuthState {
  return {
    status: "signedIn",
    user: result.user,
    tokens: {
      accessToken: result.session.accessToken,
      refreshToken: result.session.refreshToken
    }
  };
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: "hydrating",
    user: null,
    tokens: null
  });

  const setSignedOut = useCallback(async () => {
    await clearSessionStorage();
    setState({
      status: "signedOut",
      user: null,
      tokens: null
    });
  }, []);

  const applyAuthSuccess = useCallback(async (result: AuthSuccess) => {
    await persistSession({
      session: result.session,
      user: result.user
    });
    setState(toSignedIn(result));
  }, []);

  const refreshSession = useCallback(async () => {
    if (state.status !== "signedIn") {
      return;
    }

    try {
      const refreshed = await refresh(state.tokens.refreshToken);
      await applyAuthSuccess(refreshed);
    } catch (error) {
      if (isUnauthorized(error)) {
        await setSignedOut();
        return;
      }
      throw error;
    }
  }, [applyAuthSuccess, setSignedOut, state]);

  const reloadMe = useCallback(async () => {
    if (state.status !== "signedIn") {
      return;
    }

    try {
      const me = await getMe(state.tokens.accessToken);
      await persistSession({
        session: state.tokens,
        user: me
      });

      setState({
        status: "signedIn",
        user: me,
        tokens: state.tokens
      });
    } catch (error) {
      if (isUnauthorized(error)) {
        await setSignedOut();
        return;
      }
      throw error;
    }
  }, [setSignedOut, state]);

  const signIn = useCallback(
    async (input: { email: string; password: string }) => {
      const result = await login(input);
      await applyAuthSuccess(result);
    },
    [applyAuthSuccess]
  );

  const signUp = useCallback(
    async (input: { email: string; password: string; nickname: string }) => {
      const result = await register(input);
      await applyAuthSuccess(result);
    },
    [applyAuthSuccess]
  );

  const signOut = useCallback(async () => {
    if (state.status === "signedIn") {
      try {
        await logout({
          accessToken: state.tokens.accessToken,
          refreshToken: state.tokens.refreshToken
        });
      } catch {
        // Ignore logout errors during signout.
      }
    }

    await setSignedOut();
  }, [setSignedOut, state]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const persisted = await loadSessionFromStorage();
      if (!persisted || !mounted) {
        setState({
          status: "signedOut",
          user: null,
          tokens: null
        });
        return;
      }

      try {
        const me = await getMe(persisted.tokens.accessToken);
        if (!mounted) {
          return;
        }

        await persistSession({
          session: persisted.tokens,
          user: me
        });

        setState({
          status: "signedIn",
          user: me,
          tokens: persisted.tokens
        });
      } catch (firstError) {
        try {
          const refreshed = await refresh(persisted.tokens.refreshToken);
          if (!mounted) {
            return;
          }
          await applyAuthSuccess(refreshed);
        } catch {
          if (!mounted) {
            return;
          }
          console.warn("Session bootstrap failed", firstError);
          await setSignedOut();
        }
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [applyAuthSuccess, setSignedOut]);

  const value = useMemo<AuthSessionContextValue>(() => {
    return {
      isHydrating: state.status === "hydrating",
      isAuthenticated: state.status === "signedIn",
      user: state.status === "signedIn" ? state.user : null,
      accessToken: state.status === "signedIn" ? state.tokens.accessToken : null,
      refreshToken: state.status === "signedIn" ? state.tokens.refreshToken : null,
      signIn,
      signUp,
      signOut,
      refreshSession,
      reloadMe
    };
  }, [refreshSession, reloadMe, signIn, signOut, signUp, state]);

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSessionContext(): AuthSessionContextValue {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSessionContext must be used within AuthSessionProvider");
  }

  return context;
}
