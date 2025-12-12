"use client";

import axios from "axios";
import moment from "moment";
import { toast } from "sonner";

export const PUBLIC_HOST = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const baseURL = `${PUBLIC_HOST}/`;

export const MULTIPART_HEADER = {
  headers: { "Content-Type": "multipart/form-data" },
};

// 🔹 Axios instance
export const BaseRequest = axios.create({ baseURL });
BaseRequest.defaults.headers.post["Content-Type"] = "application/json";

// 🔹 Request interceptor
BaseRequest.interceptors.request.use((config) => {
  config.headers["time"] = moment().format("YYYY-MM-DD HH:mm:ss");
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// 🔹 Response interceptor
BaseRequest.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.message === "Network Error") {
      return Promise.reject("Network Error: Please check your connection.");
    }

    if (error?.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Standard browser redirect instead of Next.js router
        window.location.href = "/login";
      }
      return Promise.reject("Session expired. Please log in again.");
    }

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred.";
    return Promise.reject(message);
  }
);

// 🔹 Error handler utility
export const catchError = (error: any) => {
  toast.error(typeof error === "string" ? error : error?.message || "Error");
};
