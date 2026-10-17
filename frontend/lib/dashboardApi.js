import { api } from "./api";
export const ADOPTION_MY_PATH = "/api/adoption/my?page=1&pageSize=100";

const toList = (res) =>
  Array.isArray(res.data) ? res.data : (res.data?.items ?? []);

export const dashboardApi = {
  pets: () => api.get("/api/pets").then(toList),
  appointments: () => api.get("/api/appointments/my").then(toList),
  orders: () => api.get("/api/orders/my").then(toList),
  adoptions: () => api.get(ADOPTION_MY_PATH).then(toList),
};
