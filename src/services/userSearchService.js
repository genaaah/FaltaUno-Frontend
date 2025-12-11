import api from "./api";

export const userSearchService = {
  async getAvailableUsers() {
    try {
      const response = await api.get("/users/available");
      let users = response.data || [];

      return users.map((user) => ({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        correo_electronico: user.correo_electronico,
        visible: user.visible,
        equipo: user.equipo,
        rol: user.rol,
      }));
    } catch (error) {
      console.warn(
        "Error en /users/available:",
        error.response?.status || error.message
      );

      if (error.response?.status === 404) {
        return [];
      }

      throw new Error(
        error.response?.data?.message || "Error al obtener usuarios disponibles"
      );
    }
  },

  async searchAvailableUsers(query = "") {
    try {
      const users = await this.getAvailableUsers();

      if (query.trim()) {
        const lowerQuery = query.toLowerCase();
        return users.filter(
          (user) =>
            user.nombre?.toLowerCase().includes(lowerQuery) ||
            user.apellido?.toLowerCase().includes(lowerQuery) ||
            user.correo_electronico?.toLowerCase().includes(lowerQuery)
        );
      }

      return users;
    } catch (error) {
      console.error("Error buscando usuarios:", error);
      return [];
    }
  },

  async changeVisibility() {
    try {
      const response = await api.patch("/users/change-visibility");

      if (response.data && (response.data.message || response.data.mesagge)) {
        return {
          message: response.data.message || response.data.mesagge,
          data: response.data,
        };
      }

      return {
        message: "Visibilidad actualizada correctamente",
        data: response.data,
      };
    } catch (error) {
      console.error("Error al cambiar visibilidad:", error);

      let errorMessage = "Error al cambiar la visibilidad";

      if (error.response?.status === 400) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "No puedes cambiar tu visibilidad (quizás ya estás en un equipo)";
      }

      if (error.response?.status === 401) {
        errorMessage = "No estás autenticado";
      }

      if (error.response?.status === 403) {
        errorMessage = "No tienes permisos para esta acción";
      }

      throw new Error(errorMessage);
    }
  },

  async leaveTeam() {
    try {
      const response = await api.patch("/users/leave-team");
      return response.data;
    } catch (error) {
      console.error("Error al salir del equipo:", error);

      let errorMessage = "Error al salir del equipo";

      if (error.response?.status === 400) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "El capitán no puede salir del equipo";
      }

      if (error.response?.status === 404) {
        errorMessage = "No se encontró el equipo";
      }

      throw new Error(errorMessage);
    }
  },
};
