import axios from "axios";
import { clearSession, readSession, updateTokens } from "./auth/session";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
});

// Attach the access token to every request
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

let refreshing = null; 

function refreshTokens() {
  const refreshToken = readSession()?.refreshToken;
  if (!refreshToken) return Promise.reject(new Error("No refresh token"));

  refreshing ??= axios
    .post(
      "/api/auth/refresh-token",
      { refreshToken },
      { baseURL: api.defaults.baseURL },
    )
    .then(({ data }) => {
      updateTokens({
        token: data.token,
        expiresAt: data.expiresAt,
        refreshToken: data.refreshToken,
        refreshTokenExpiresAt: data.refreshTokenExpiresAt,
      });
      return data.token;
    })
    .finally(() => {
      refreshing = null;
    });

  return refreshing;
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const isAuthCall = original?.url?.includes("/api/auth/");

    if (
      typeof window === "undefined" ||
      err.response?.status !== 401 ||
      !original ||
      isAuthCall ||
      original._retry ||
      !readSession() 
    ) {
      return Promise.reject(err);
    }

    original._retry = true;
    try {
      const token = await refreshTokens();
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch (refreshErr) {
      if (refreshErr?.config || refreshErr?.message === "No refresh token") {
        clearSession();
        window.dispatchEvent(new Event("petmate:unauthorized"));
        return Promise.reject(err);
      }
      return Promise.reject(refreshErr);
    }
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

// Doctors API
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

// Appointments API
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
        const { data } = await api.get("/api/appointments", {
          signal,
        });

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

// Products API
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

// Cart API
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

// Orders API
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
    const { data } = await api.get(`/api/orders/${id}`, {
      signal,
    });

    return data;
  },
};

// User Profile API
export const userApi = {
  async getProfile(signal) {
    const { data } = await api.get("/api/users/me", { signal });
    return data;
  },

  async updateProfile({ fullName, country, bio, profileImageUrl }) {
    const { data } = await api.put("/api/users/me", {
      fullName,
      country,
      bio,
      profileImageUrl,
    });
    return data;
  },

  async changePassword({ currentPassword, newPassword }) {
    const { data } = await api.post("/api/users/me/change-password", {
      currentPassword,
      newPassword,
    });
    return data;
  },
};

// Lookups API
export const lookupsApi = {
  async petTypes(signal) {
    const { data } = await api.get("/api/lookups/pet-types", { signal });
    return data;
  },

  async breeds(petTypeId, signal) {
    if (!petTypeId) return [];
    const { data } = await api.get(
      `/api/lookups/pet-types/${petTypeId}/breeds`,
      {
        signal,
      },
    );
    return data;
  },
};

// Pets API
export const petsApi = {
  async list(signal) {
    const { data } = await api.get("/api/pets", { signal });
    return data;
  },

  async get(petId, signal) {
    const { data } = await api.get(`/api/pets/${petId}`, { signal });
    return data;
  },

  async create(petData) {
    const { data } = await api.post("/api/pets", petData);
    return data;
  },

  async update(petId, petData) {
    const { data } = await api.put(`/api/pets/${petId}`, petData);
    return data;
  },

  async delete(petId) {
    const { data } = await api.delete(`/api/pets/${petId}`);
    return data;
  },

  async medicalHistory(petId, signal) {
    const { data } = await api.get(`/api/pets/${petId}/medical-history`, {
      signal,
    });
    return data;
  },

  async addMedicalHistory(petId, { title, description }) {
    const { data } = await api.post(`/api/pets/${petId}/medical-history`, {
      title,
      description,
    });
    return data;
  },

  async vaccinations(petId, signal) {
    const { data } = await api.get(`/api/pets/${petId}/vaccinations`, {
      signal,
    });
    return data;
  },

  async addVaccination(petId, { name, dateGiven, nextDueDate, notes }) {
    const { data } = await api.post(`/api/pets/${petId}/vaccinations`, {
      name,
      dateGiven,
      nextDueDate,
      notes,
    });
    return data;
  },
};

// Files API
export const filesApi = {
  async upload(file, type = "profiles") {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post(
      `/api/files/upload?type=${type}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  },
};

// Adoption API
export const adoptionApi = {
  async list({ page = 1, pageSize = 20 } = {}, signal) {
    const { data } = await api.get("/api/adoption", {
      params: { page, pageSize },
      signal,
    });
    return data;
  },

  async get(id, signal) {
    const { data } = await api.get(`/api/adoption/${id}`, { signal });
    return data;
  },

  async mine({ page = 1, pageSize = 20 } = {}, signal) {
    const { data } = await api.get("/api/adoption/my", {
      params: { page, pageSize },
      signal,
    });
    return data;
  },

  async create(listing) {
    const { data } = await api.post("/api/adoption", listing);
    return data;
  },

  async update(id, listing) {
    const { data } = await api.put(`/api/adoption/${id}`, listing);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/api/adoption/${id}`);
    return data;
  },
};
