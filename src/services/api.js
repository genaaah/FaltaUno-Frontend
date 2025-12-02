import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Error de API:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });

      if (error.response.status === 401) {
        console.warn("Token expirado o no válido");
        if (window.location.pathname !== "/auth") {
          window.location.href = "/auth";
        }
      }
    } else if (error.request) {
      console.error("Error de red: No hay respuesta del servidor");
    } else {
      console.error("Error de configuración:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
