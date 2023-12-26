import axios from "axios";

const axios_instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

axios_instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios_instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalConfig = error.config;
    if (error.response?.status === 401 && !originalConfig.retry) {
      originalConfig.retry = true;

      if (originalConfig.url === "/api/inventory/login") {
        return Promise.reject(error);
      }

      axios_instance
        .post("/api/inventory/retry", {
          refresh: "",
        })
        .then((response) => {
          return axios_instance(originalConfig);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    } else if (error.response && error.response.status !== 422) {
      window.location.href = "/login";
    } else {
      return Promise.reject(error);
    }
  }
);

export default axios_instance;
