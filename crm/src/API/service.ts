import axios, { AxiosInstance } from "axios";
import { IUser } from "../types";

let isRefreshing = false;
let refreshTimer: NodeJS.Timeout | null = null;
const refreshSubscribers: ((token: string) => void)[] = [];

export const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const subscribeToTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers.length = 0;
};

api.interceptors.request.use(
  (config) => {
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
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const user = await refreshToken();

          if (user?.accessToken) {
            localStorage.setItem("accessToken", user.accessToken);
            onTokenRefreshed(user.accessToken);
          }

          return api.request(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve, reject) => {
          subscribeToTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api.request(originalRequest));
          });
          if (refreshTimer) {
            clearTimeout(refreshTimer);
          }
          refreshTimer = setTimeout(() => {
            reject(error);
          }, 2000);
        });
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export const refreshToken = async (): Promise<IUser | null> => {
  const { data } = await api.get("/refresh");
  return data;
};
