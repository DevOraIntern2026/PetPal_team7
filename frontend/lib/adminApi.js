import { api } from "./api";
const crud = (base) => ({
  list: (params) => api.get(base, { params }).then((r) => r.data),
  create: (body) => api.post(base, body).then((r) => r.data),
  update: (id, body) => api.put(`${base}/${id}`, body).then((r) => r.data),
  remove: (id) => api.delete(`${base}/${id}`).then((r) => r.data),
});

export const adminApi = {
  products: crud("/api/admin/products"),
  doctors: crud("/api/admin/doctors"),
};
