import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    if (status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refreshToken");
      if (!refresh) throw error;
      const r = await axios.post(`${API_BASE_URL}/auth/refresh/`, { refresh });
      localStorage.setItem("accessToken", r.data.access);
      original.headers.Authorization = `Bearer ${r.data.access}`;
      return axios(original);
    }
    throw error;
  },
);

