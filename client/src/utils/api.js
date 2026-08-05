import axios from "axios";
import { API_BASE_URL } from "./brand";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (username, email, password) =>
    api.post("/api/users", { username, email, password }),
  login: (email, password) =>
    api.post("/api/users/login", { email, password }),
  logout: () => api.post("/api/users/logout"),
  getMe: () => api.get("/api/users/me"),
  getUser: (id) => api.get(`/api/users/${id}`),
};

export const itemsAPI = {
  getAll: () => api.get("/api/items"),
  getById: (id) => api.get(`/api/items/${id}`),
  create: (data) => api.post("/api/items", data),
  update: (id, data) => api.put(`/api/items/${id}`, data),
  delete: (id) => api.delete(`/api/items/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get("/api/categories"),
  getById: (id) => api.get(`/api/categories/${id}`),
};

export default api;
