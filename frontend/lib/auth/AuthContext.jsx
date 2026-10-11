"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);
const KEY = "petmate:user";

function readUser() {
  try {
    return JSON.parse(
      localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY) ?? "null",
    );
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [promptReason, setPromptReason] = useState(null); // null = modal closed

  useEffect(() => {
    setUser(readUser());
    setReady(true);
  }, []);

  // TODO: replace the fake delay with the real Axios call once the API exists
  const login = useCallback(async ({ email, remember }) => {
    await new Promise((r) => setTimeout(r, 600));
    const nextUser = { id: "demo", name: email.split("@")[0], email };
    (remember ? localStorage : sessionStorage).setItem(
      KEY,
      JSON.stringify(nextUser),
    );
    setUser(nextUser);
  }, []);

  const signup = useCallback(async ({ name, email }) => {
    await new Promise((r) => setTimeout(r, 600));
    const nextUser = { id: "demo", name, email };
    localStorage.setItem(KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    setUser(null);
  }, []);

  // Runs `action` if signed in, otherwise opens the sign-in modal.
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
