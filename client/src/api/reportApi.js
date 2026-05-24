import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const imageBaseUrl = (import.meta.env.VITE_SERVER_URL || "").replace(/\/$/, "");

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("civicconnect_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const registerUser = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const getReports = async (params = {}) => {
  const response = await api.get("/reports", { params });
  return response.data;
};

export const getMyReports = async () => {
  const response = await api.get("/reports/my");
  return response.data;
};

export const createReport = async (formData) => {
  const response = await api.post("/reports", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const updateReportStatus = async (id, status) => {
  const response = await api.put(`/reports/${id}/status`, { status });
  return response.data;
};

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export default api;
