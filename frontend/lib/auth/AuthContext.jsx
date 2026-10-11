"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authApi } from "./authApi";
import { getErrorMessage } from "../api";
import { clearSession, readSession, saveSession } from "./session";

const AuthContext = createContext(null);
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function toSession(data) {
  return {
    token: data.token,
    expiresAt: data.expiresAt,
    user: { id: data.userId, name: data.fullName, email: data.email },
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [promptReason, setPromptReason] = useState(null);

  useEffect(() => {
    setUser(readSession()?.user ?? null);
    setReady(true);

    const onUnauthorized = () => setUser(null);
    window.addEventListener("petmate:unauthorized", onUnauthorized);
    return () =>
      window.removeEventListener("petmate:unauthorized", onUnauthorized);
  }, []);

  const login = useCallback(async ({ email, password, remember }) => {
    let session;
    if (USE_MOCK) {
      await wait(600);
      session = {
        token: "mock",
        expiresAt: null,
        user: { id: "demo", name: email.split("@")[0], email },
      };
    } else {
      try {
        session = toSession(await authApi.login({ email, password }));
      } catch (err) {
        throw new Error(
          getErrorMessage(err, "Couldn't log in. Please try again."),
        );
      }
    }
    saveSession(session, remember);
    setUser(session.user);
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    let session;
    if (USE_MOCK) {
      await wait(600);
      session = {
        token: "mock",
        expiresAt: null,
        user: { id: "demo", name, email },
      };
    } else {
      try {
        let data = await authApi.signup({ name, email, password });
        // If register doesn't return a token, log in right after
        if (!data?.token) data = await authApi.login({ email, password });
        session = toSession(data);
      } catch (err) {
        throw new Error(
          getErrorMessage(
            err,
            "Couldn't create your account. Please try again.",
          ),
        );
      }
    }
    saveSession(session, true);
    setUser(session.user);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const requireAuth = useCallback(
    (reason, action) => {
      if (user) {
        action?.();
        return true;
      }
      setPromptReason(reason ?? "default");
      return false;
    },
    [user],
  );

  const closePrompt = useCallback(() => setPromptReason(null), []);

  const value = useMemo(
    () => ({
      user,
      ready,
      login,
      signup,
      logout,
      requireAuth,
      promptReason,
      closePrompt,
    }),
    [
      user,
      ready,
      login,
      signup,
      logout,
      requireAuth,
      promptReason,
      closePrompt,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
