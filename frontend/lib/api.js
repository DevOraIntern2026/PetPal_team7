import axios from "axios";
import { clearSession, readSession } from "./auth/session";

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = readSession()?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthCall = err.config?.url?.includes("/api/auth/");
    if (
      err.response?.status === 401 &&
      !isAuthCall &&
      typeof window !== "undefined"
    ) {
      clearSession();
      window.dispatchEvent(new Event("petmate:unauthorized"));
    }
    return Promise.reject(err);
  },
);

export function getErrorMessage(
  err,
  fallback = "Something went wrong. Please try again.",
) {
  const data = err?.response?.data;
  const firstValidation = data?.errors && Object.values(data.errors).flat()[0];
  return (
    firstValidation ??
    data?.message ??
    data?.title ??
    (typeof data === "string" && data.length < 200 ? data : null) ??
    fallback
  );
}
