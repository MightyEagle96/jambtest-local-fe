import axios from "axios";

//export const baseURL = "http://localhost:4000/api/";

export const routeBaseURL = "/api";

const getBaseURL = () => {
  if (window.location.hostname === "localhost") {
    return "http://localhost:4000/api/";
  }
  // Use the backend running on same host as the frontend
  return `${window.location.protocol}//${window.location.hostname}:4000/api/`;
};

export const baseURL = getBaseURL();

const appHttpService = axios.create({
  baseURL,
  withCredentials: true, // always send cookies
  timeout: 60_000,
});

// No need to store or attach tokens manually anymore
appHttpService.interceptors.request.use(
  (config) => {
    // you can add custom headers here if needed
    return config;
  },
  (error) => Promise.reject(error)
);
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

appHttpService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue failed requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => appHttpService(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try refresh
        await appHttpService.get("/auth/refresh"); // 🚨 Make sure this matches your backend

        processQueue(null);
        return appHttpService(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // 🚨 Both original + refresh failed with 401 → redirect
        if (err.response?.status === 401) {
          console.warn("Both tokens expired. Logging out...");
          window.location.href = "/"; // clear session
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Fallback error handling
    if (error.response) {
      return { error: error.response.data, status: error.response.status };
    }
    return { error: "Network connection lost" };
  }
);

export { appHttpService };
