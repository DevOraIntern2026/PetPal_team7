import axios from "axios";
import { clearSession, readSession } from "./auth/session";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: {
    "X-Tunnel-Skip-Anti-Abuse-Page": "true",
  },
});

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

export const doctorsApi = {
  async list({ specialty, page = 1, pageSize = 100 } = {}, signal) {
    const params = { page, pageSize };
    if (specialty && specialty !== "All Specialties") {
      params.specialty = specialty;
    }

    const { data } = await api.get("/api/doctors", {
      params,
      signal,
    });

    return data;
  },

  async get(id, signal) {
    const { data } = await api.get(`/api/doctors/${id}`, {
      signal,
    });

    return data;
  },

  async availability(id, date, signal) {
    const { data } = await api.get(`/api/doctors/${id}/availability`, {
      params: { date },
      signal,
    });

    return data;
  },
};

export const appointmentsApi = {
  async book(appointmentData) {
    const { data } = await api.post("/api/appointments", appointmentData);

    return data;
  },

  async mine(signal) {
    try {
      const { data } = await api.get("/api/appointments/my", {
        signal,
      });
      return data;
    } catch (err) {
      if (err.response?.status === 404) {
        const { data } = await api.get("/api/appointments", { signal });
        return data;
      }
      throw err;
    }
  },

  async get(id, signal) {
    const { data } = await api.get(`/api/appointments/${id}`, {
      signal,
    });

    return data;
  },

  async cancel(id) {
    const { data } = await api.delete(`/api/appointments/${id}`);
    return data;
  },
};
