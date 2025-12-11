import api from "./api";

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", {
        correo_electronico: email,
        contrasena: password,
      });

      const userData = response.data;
      if (userData && userData.equipo === null) {
        userData.equipo = null;
        userData.equipoId = null;
      } else if (userData.equipo) {
        userData.equipoId = userData.equipo.id;
      }

      return userData;
    } catch (error) {
      let errorMessage = "Error al iniciar sesión";

      if (error.response?.status === 401) {
        errorMessage = "Credenciales incorrectas";
      } else if (error.response?.status === 404) {
        errorMessage = "Usuario no encontrado";
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Datos inválidos";
      }

      throw new Error(errorMessage);
    }
  },

  async register(userData) {
    try {
      const response = await api.post("/auth/register", {
        nombre: userData.nombre,
        apellido: userData.apellido,
        correo_electronico: userData.email,
        contrasena: userData.password,
      });
      return response.data;
    } catch (error) {
      let errorMessage = "Error al registrar usuario";

      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Datos inválidos";
      } else if (error.response?.status === 409) {
        errorMessage = "El email ya está registrado";
      }

      throw new Error(errorMessage);
    }
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  },

  async getProfile() {
    try {
      const response = await api.get("/auth/profile");
      const userData = response.data;

      if (userData.equipo === null) {
        userData.equipo = null;
        userData.equipoId = null;
      } else if (userData.equipo) {
        userData.equipoId = userData.equipo.id;
      }

      return userData;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        error.response?.data?.message || "Error al obtener perfil"
      );
    }
  },

  async refreshUserData() {
    return this.getProfile();
  },
};
