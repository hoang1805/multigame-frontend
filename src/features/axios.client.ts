import axios, { HttpStatusCode } from "axios";
import { store } from "../app/store";
import { login, logout } from "./auth/auth.slice";

export const axiosClient = () => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // URL backend NestJS
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response?.status === HttpStatusCode.Unauthorized &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const refreshToken = store.getState().auth.refreshToken ?? '';
          const res = await api.get(`/auth/refresh?refreshToken=${refreshToken}`);
          const newAccessToken = res.data.accessToken;
          store.dispatch(login({ accessToken: newAccessToken, refreshToken }));

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (err) {
            store.dispatch(logout());
            return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};
