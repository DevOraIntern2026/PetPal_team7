"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authApi } from "./authApi";
import { getErrorMessage } from "../api";
import { clearSession, readSession, saveSession } from "./session";

const AuthContext = createContext(null);
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Data that belongs to the signed-in user and must not leak to the next one
const USER_DATA_KEYS = ["petmate-cart", "petpal:profile_image"];

function clearUserData() {
  USER_DATA_KEYS.forEach((key) => localStorage.removeItem(key));
  window.dispatchEvent(new Event("petmate:cart-updated")); // tells useCart to empty itself
}

function toSession(data) {
  return {
    token: data.token,
    expiresAt: data.expiresAt,
    refreshToken: data.refreshToken,
    refreshTokenExpiresAt: data.refreshTokenExpiresAt,
    user: {
      id: data.userId,
      name: data.fullName,
      email: data.email,
      roles: data.roles ?? [],
    },
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [promptReason, setPromptReason] = useState(null); // null = modal closed
  const [promptRedirect, setPromptRedirect] = useState(null); // where to go after login

  useEffect(() => {
    setUser(readSession()?.user ?? null);
    setReady(true);

    const onUnauthorized = () => {
      clearUserData();
      setUser(null);
    };
    window.addEventListener("petmate:unauthorized", onUnauthorized);
    return () =>
      window.removeEventListener("petmate:unauthorized", onUnauthorized);
  }, []);

  async function login({ email, password, remember }) {
    let session;
    if (USE_MOCK) {
      await wait(600);
      session = {
        token: "mock",
        user: { id: "demo", name: email.split("@")[0], email, roles: [] },
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
  }

  async function signup({ name, email, password }) {
    let session;
    if (USE_MOCK) {
      await wait(600);
      session = { token: "mock", user: { id: "demo", name, email, roles: [] } };
    } else {
      try {
        let data = await authApi.signup({ name, email, password });
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
  }

  async function logout() {
    const refreshToken = readSession()?.refreshToken;
    if (!USE_MOCK && refreshToken) {
      try {
        await authApi.logout(refreshToken); // needs the token, so call before clearing
      } catch {
        // still sign out locally if the server call fails
      }
    }
    clearSession();
    clearUserData();
    setUser(null);
  }

  // Runs `action` if signed in, otherwise opens the sign-in modal.
  // `redirectTo` (optional) is where the user lands after logging in.
  const requireAuth = useCallback(
    (reason, action, redirectTo) => {
      if (user) {
        action?.();
        return true;
      }
      setPromptReason(reason ?? "default");
      setPromptRedirect(redirectTo ?? null);
      return false;
    },
    [user],
  );

  function closePrompt() {
    setPromptReason(null);
    setPromptRedirect(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        ready,
        login,
        signup,
        logout,
        requireAuth,
        promptReason,
        promptRedirect,
        closePrompt,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
