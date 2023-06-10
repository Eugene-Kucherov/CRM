import axios, { AxiosInstance } from "axios";
import { IUser } from "../types";

export const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await refreshToken();
        return api.request(error.config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export const refreshToken = async (): Promise<IUser | null> => {
  const { data } = await api.get("/refresh");
  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }
  return data;
};