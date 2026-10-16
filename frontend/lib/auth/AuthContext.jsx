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

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function toSession(data, fallbackEmail = "", fallbackName = "") {
  const emailFallbackName = fallbackEmail
    ? fallbackEmail.split("@")[0]
    : "Pet Lover";

  const defaultName = fallbackName || emailFallbackName;

  const token =
    data?.token ??
    data?.accessToken ??
    data?.jwt ??
    data?.data?.token ??
    data?.data?.accessToken ??
    data?.data?.jwt ??
    "";

  return {
    token,
    refreshToken: data?.refreshToken ?? data?.data?.refreshToken ?? "",
    expiresAt: data?.expiresAt ?? data?.data?.expiresAt ?? null,
    user: {
      id: data?.userId ?? data?.id ?? data?.user?.id ?? "user",
      name:
        data?.fullName ??
        data?.name ??
        data?.user?.fullName ??
        data?.user?.name ??
        defaultName,
      email: data?.email ?? data?.user?.email ?? fallbackEmail,
    },
  };
}

export function AuthProvider({ children }) {
  // Same initial state on the server and the client.
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [promptReason, setPromptReason] = useState(null);
  const [promptRedirect, setPromptRedirect] = useState(null);

  useEffect(() => {
    // Read the saved session only after the component mounts.
    setUser(readSession()?.user ?? null);
    setReady(true);

    const onUnauthorized = () => {
      clearSession();
      setUser(null);
      setPromptReason(null);
      setPromptRedirect(null);
    };

    window.addEventListener("petmate:unauthorized", onUnauthorized);

    return () => {
      window.removeEventListener("petmate:unauthorized", onUnauthorized);
    };
  }, []);

  const login = useCallback(async ({ email, password, remember }) => {
    let session;

    if (USE_MOCK) {
      await wait(600);

      session = {
        token: "mock",
        expiresAt: null,
        user: {
          id: "demo",
          name: email.split("@")[0],
          email,
        },
      };
    } else {
      try {
        session = toSession(await authApi.login({ email, password }), email);
      } catch (err) {
        throw new Error(
          getErrorMessage(err, "Couldn't log in. Please try again."),
        );
      }
    }

    saveSession(session, remember);
    setUser(session.user);
    setPromptReason(null);
    setPromptRedirect(null);
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
        let data = await authApi.signup({
          name,
          email,
          password,
        });

        const hasToken =
          data?.token ??
          data?.accessToken ??
          data?.jwt ??
          data?.data?.token ??
          data?.data?.accessToken ??
          data?.data?.jwt;

        // If registration doesn't return a token, log in afterward.
        if (!hasToken) {
          data = await authApi.login({ email, password });
        }

        session = toSession(data, email, name);
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
    setPromptReason(null);
    setPromptRedirect(null);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setPromptReason(null);
    setPromptRedirect(null);
  }, []);

  const requireAuth = useCallback(
    (reason, action, redirectUrl) => {
      const activeUser = user || (ready ? readSession()?.user : null);

      if (activeUser) {
        action?.();
        return true;
      }

      setPromptReason(reason ?? "default");
      setPromptRedirect(redirectUrl ?? null);

      return false;
    },
    [user, ready],
  );

  const closePrompt = useCallback(() => {
    setPromptReason(null);
    setPromptRedirect(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      requireAuth,
      promptReason,
      promptRedirect,
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
      promptRedirect,
      closePrompt,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return ctx;
}
