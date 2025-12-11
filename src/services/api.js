import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error("❌ Error de red:", error.message);
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const url = error.config?.url || "";
    const isProfileCheck = url.includes("/auth/profile");

    if (!(status === 401 && isProfileCheck)) {
      console.error(`❌ Error ${status} en ${url}:`, data);
    }

    const errorMessages = {
      400: {
        default: "Datos incorrectos",
        "Correo electrónico ingresado ya existente":
          "El correo ya está registrado",
        "Documento ingresado ya existente": "El documento ya está registrado",
        "Las contraseñas no coinciden": "Las contraseñas no coinciden",
        "Contraseña incorrecta": "Contraseña incorrecta",
        "Ya tiene un equipo": "Ya tienes un equipo",
        "No puedes crear un partido contra ti mismo":
          "No puedes jugar contra tu propio equipo",
        "El capitan no puede salir del equipo":
          "Como capitán, debes eliminar el equipo en lugar de salir",
        "Cuenta no verificada": "Primero debes verificar tu cuenta",
      },
      401: {
        default: "Sesión expirada",
        "Debes verificar tu cuenta":
          "Verifica tu cuenta antes de iniciar sesión",
        "Token no valido": "Enlace de verificación no válido",
        "Token expirado": "Sesión expirada",
      },
      403: "No tienes permisos",
      404: "",
      409: {
        default: "Conflicto de datos",
        "Nombre ingresado ya en uso": "Nombre de equipo en uso",
        "Invitación ya existente": "Ya invitaste a este jugador",
      },
      500: "Error del servidor",
    };

    let userMessage = "";

    if (status >= 500) {
      userMessage = errorMessages[500];
    } else if (errorMessages[status]) {
      if (typeof errorMessages[status] === "string") {
        userMessage = errorMessages[status];
      } else if (typeof errorMessages[status] === "object") {
        const backendMessage = data?.message || "";
        userMessage =
          errorMessages[status][backendMessage] ||
          errorMessages[status].default;
      }
    }

    const showAlert =
      userMessage &&
      !(status === 401 && isProfileCheck) &&
      !(status === 404 && !userMessage);

    const isAuthPage = window.location.pathname.includes("/auth");
    const isVerificationPage =
      window.location.pathname.includes("/verificacion");
    const isRecoveryPage = window.location.pathname.includes("/recuperar");

    if (showAlert && !isAuthPage && !isVerificationPage && !isRecoveryPage) {
      setTimeout(() => {
        import("../utils/sweetAlert").then(({ sweetAlert }) => {
          sweetAlert.error("Error", userMessage);
        });
      }, 100);
    }

    const isProtectedPage =
      !isAuthPage && !isVerificationPage && !isRecoveryPage;
    if (status === 401 && isProtectedPage && !isProfileCheck) {
      setTimeout(() => {
        import("../utils/sweetAlert").then(({ sweetAlert }) => {
          sweetAlert.warning(
            "Sesión expirada",
            "Por favor, inicia sesión nuevamente."
          );
          setTimeout(() => {
            window.location.href = "/auth";
          }, 2000);
        });
      }, 100);
    }

    return Promise.reject({
      ...error,
      userMessage: data?.message || userMessage,
    });
  }
);

export default api;
