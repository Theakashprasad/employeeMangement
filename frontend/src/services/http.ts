import axios from "axios";
import { getStoredToken, clearAuthStorage } from "./login.service";

export const API_BASE =
  import.meta.env.VITE_API_BASE ?? "http://localhost:5000/api";

const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, string> | undefined;
    return (
      data?.message ??
      data?.Message ??
      error.message ??
      "Request failed"
    );
  }
  if (error instanceof Error) return error.message;
  return "Request failed";
};

export const http = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const authHttp = axios.create({
  baseURL: `${API_BASE}/auth`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

import type { InternalAxiosRequestConfig } from "axios";

const attachToken = (config: InternalAxiosRequestConfig) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

http.interceptors.request.use(attachToken);
authHttp.interceptors.request.use(attachToken);

const handleAuthError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    clearAuthStorage();
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  }
  return Promise.reject(new Error(extractErrorMessage(error)));
};

http.interceptors.response.use((res) => res, handleAuthError);
authHttp.interceptors.response.use((res) => res, handleAuthError);
