import axios from "axios";

export const baseURL = "http://localhost:4001/";

const systemHttpService = axios.create({
  baseURL,
  //  withCredentials: true, // always send cookies
  timeout: 30_000,
});

// No need to store or attach tokens manually anymore
systemHttpService.interceptors.request.use(
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

systemHttpService.interceptors.response.use(
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
          .then(() => systemHttpService(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try refresh
        await systemHttpService.get("/refresh"); // 🚨 Make sure this matches your backend

        processQueue(null);
        return systemHttpService(originalRequest);
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

export { systemHttpService };
