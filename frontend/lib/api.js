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
    if (token) {
      if (config.headers?.set) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";
    const isAuthCall = url.includes("/api/auth/");
    const isStoreOrCart =
      url.includes("/api/products") || url.includes("/api/cart");

    // Do NOT clear user session on 401 from products or cart requests.
    // Only clear session when an explicit user authentication verification fails.
    if (
      err.response?.status === 401 &&
      !isAuthCall &&
      !isStoreOrCart &&
      url.includes("/api/users/me") &&
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
  async list({ specialty, page = 1, pageSize = 20 } = {}, signal) {
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

export const productsApi = {
  async list({ category, search, page = 1, pageSize = 20 } = {}, signal) {
    const params = { page, pageSize };
    if (category && category !== "All") {
      params.category = category;
    }
    if (search && search.trim()) {
      params.search = search.trim();
    }

    const { data } = await api.get("/api/products", {
      params,
      signal,
    });

    return data;
  },

  async get(id, signal) {
    const { data } = await api.get(`/api/products/${id}`, {
      signal,
    });

    return data;
  },
};

export const cartApi = {
  async get(signal) {
    const { data } = await api.get("/api/cart", { signal });
    return data;
  },

  async addItem({ productId, quantity = 1 }) {
    const { data } = await api.post("/api/cart/items", {
      productId,
      quantity,
    });
    return data;
  },

  async updateItem(productId, quantity) {
    const { data } = await api.put(`/api/cart/items/${productId}`, {
      quantity,
    });
    return data;
  },

  async removeItem(productId) {
    const { data } = await api.delete(`/api/cart/items/${productId}`);
    return data;
  },

  async clear() {
    const { data } = await api.delete("/api/cart");
    return data;
  },
};

export const ordersApi = {
  async checkout({ deliveryAddress, paymentMethod = "Cash" }) {
    const { data } = await api.post("/api/orders/checkout", {
      deliveryAddress,
      paymentMethod,
    });
    return data;
  },

  async mine(signal) {
    const { data } = await api.get("/api/orders/my", { signal });
    return data;
  },

  async get(id, signal) {
    const { data } = await api.get(`/api/orders/${id}`, { signal });
    return data;
  },
};
