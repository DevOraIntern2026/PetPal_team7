import { api } from "../api";

export const authApi = {
  login: ({ email, password }) =>
    api.post("/api/auth/login", { email, password }).then((r) => r.data),

  signup: ({ name, email, password }) =>
    api
      .post("/api/auth/register", { fullName: name, email, password })
      .then((r) => r.data),
};
