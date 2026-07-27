import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Important: do NOT set Content-Type for FormData.
  // Axios will set multipart/form-data with the required boundary itself.
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    return Promise.reject({
      ...error,
      displayMessage: message
    });
  }
);

export default API;