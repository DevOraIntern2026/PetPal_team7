"use client";

import { useAuth as useAuthOriginal } from "../lib/auth/AuthContext";

export function useAuth() {
  const auth = useAuthOriginal();
  return {
    ...auth,
    isAuthenticated: Boolean(auth?.user),
  };
}

export default useAuth;

