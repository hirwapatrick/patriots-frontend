import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => API.post("/auth/login", data),
  register: (data) => API.post("/auth/register", data),
  me: () => API.get("/auth/me"),
};

export const projectAPI = {
  getAll: (params) => API.get("/projects", { params }),
  getAllAdmin: () => API.get("/projects/all"),
  getBySlug: (slug) => API.get(`/projects/${slug}`),
  create: (data) => API.post("/projects", data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.delete(`/projects/${id}`),
};

export const categoryAPI = {
  getAll: () => API.get("/categories"),
  getBySlug: (slug) => API.get(`/categories/${slug}`),
  create: (data) => API.post("/categories", data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

export const uploadAPI = {
  single: (formData) =>
    API.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  multiple: (formData) =>
    API.post("/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const playerAPI = {
  getAll: (params) => API.get("/players", { params }),
  getAllAdmin: () => API.get("/players/all"),
  getById: (id) => API.get(`/players/${id}`),
  create: (data) => API.post("/players", data),
  update: (id, data) => API.put(`/players/${id}`, data),
  delete: (id) => API.delete(`/players/${id}`),
};

export const staffAPI = {
  getAll: (params) => API.get("/staff", { params }),
  getAllAdmin: () => API.get("/staff/all"),
  getById: (id) => API.get(`/staff/${id}`),
  create: (data) => API.post("/staff", data),
  update: (id, data) => API.put(`/staff/${id}`, data),
  delete: (id) => API.delete(`/staff/${id}`),
};

export const gameAPI = {
  getAll: (params) => API.get("/games", { params }),
  getUpcoming: () => API.get("/games/upcoming"),
  getResults: () => API.get("/games/results"),
  getFeatured: () => API.get("/games/featured"),
  getAllAdmin: () => API.get("/games/all"),
  getById: (id) => API.get(`/games/${id}`),
  create: (data) => API.post("/games", data),
  update: (id, data) => API.put(`/games/${id}`, data),
  delete: (id) => API.delete(`/games/${id}`),
};

export const competitionAPI = {
  getAll: () => API.get("/competitions"),
  getAllAdmin: () => API.get("/competitions/all"),
  getById: (id) => API.get(`/competitions/${id}`),
  create: (data) => API.post("/competitions", data),
  update: (id, data) => API.put(`/competitions/${id}`, data),
  delete: (id) => API.delete(`/competitions/${id}`),
};

export const playerStatsAPI = {
  getAll: (params) => API.get("/player-stats", { params }),
  getByPlayer: (playerId) => API.get(`/player-stats/player/${playerId}`),
  create: (data) => API.post("/player-stats", data),
  update: (id, data) => API.put(`/player-stats/${id}`, data),
  delete: (id) => API.delete(`/player-stats/${id}`),
};

export const teamStatsAPI = {
  getAll: (params) => API.get("/team-stats", { params }),
  create: (data) => API.post("/team-stats", data),
  update: (id, data) => API.put(`/team-stats/${id}`, data),
  delete: (id) => API.delete(`/team-stats/${id}`),
};

export const newsAPI = {
  getAll: (params) => API.get("/news", { params }),
  getAllAdmin: () => API.get("/news/all"),
  getLatest: () => API.get("/news/latest"),
  getBySlug: (slug) => API.get(`/news/${slug}`),
  create: (data) => API.post("/news", data),
  update: (id, data) => API.put(`/news/${id}`, data),
  delete: (id) => API.delete(`/news/${id}`),
};

export const galleryAPI = {
  getAll: (params) => API.get("/gallery", { params }),
  getAllAdmin: () => API.get("/gallery/all"),
  getById: (id) => API.get(`/gallery/${id}`),
  create: (data) => API.post("/gallery", data),
  update: (id, data) => API.put(`/gallery/${id}`, data),
  delete: (id) => API.delete(`/gallery/${id}`),
};

export const sponsorAPI = {
  getAll: () => API.get("/sponsors"),
  getAllAdmin: () => API.get("/sponsors/all"),
  getById: (id) => API.get(`/sponsors/${id}`),
  create: (data) => API.post("/sponsors", data),
  update: (id, data) => API.put(`/sponsors/${id}`, data),
  delete: (id) => API.delete(`/sponsors/${id}`),
};

export const achievementAPI = {
  getAll: () => API.get("/achievements"),
  getAllAdmin: () => API.get("/achievements/all"),
  getById: (id) => API.get(`/achievements/${id}`),
  create: (data) => API.post("/achievements", data),
  update: (id, data) => API.put(`/achievements/${id}`, data),
  delete: (id) => API.delete(`/achievements/${id}`),
};

export const homepageAPI = {
  get: () => API.get("/homepage"),
  update: (data) => API.put("/homepage", data),
};

export const settingsAPI = {
  get: () => API.get("/settings"),
  update: (data) => API.put("/settings", data),
};

export const contactAPI = {
  submit: (data) => API.post("/contact", data),
  send: (data) => API.post("/contact", data),
  getAll: () => API.get("/contact"),
  markRead: (id) => API.put(`/contact/${id}/read`),
  delete: (id) => API.delete(`/contact/${id}`),
};

export const dashboardAPI = {
  getStats: () => API.get("/dashboard"),
};

export default API;
