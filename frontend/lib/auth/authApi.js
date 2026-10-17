import { api } from "../api";

export const authApi = {
  login: ({ email, password }) =>
    api.post("/api/auth/login", { email, password }).then((r) => r.data),

  signup: ({ name, email, password }) =>
    api
      .post("/api/auth/register", { fullName: name, email, password })
      .then((r) => r.data),

  // Check the last two against Postman: I'm guessing the path and body
  refresh: (refreshToken) =>
    api.post("/api/auth/refresh", { refreshToken }).then((r) => r.data),
  logout: (refreshToken) =>
    api.post("/api/auth/logout", { refreshToken }).then((r) => r.data),

  forgotPassword: ({ email }) =>
    api.post("/api/auth/forgot-password", { email }).then((r) => r.data),

  resetPassword: ({ email, code, newPassword }) =>
    api
      .post("/api/auth/reset-password", { email, code, newPassword })
      .then((r) => r.data),
};
