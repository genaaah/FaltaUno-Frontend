import api from "./api";

export const userService = {
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al actualizar usuario"
      );
    }
  },

  async deleteUser() {
    try {
      const response = await api.delete("/users");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al eliminar usuario"
      );
    }
  },

  async findByEmail(email) {
    try {
      const response = await api.get(`/users/email/${email}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al buscar usuario"
      );
    }
  },

  async changeVisibility() {
    try {
      const response = await api.patch("/users/change-visibility");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al cambiar visibilidad"
      );
    }
  },

  async leaveTeam() {
    try {
      const response = await api.patch("/users/leave-team");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al salir del equipo"
      );
    }
  },
};
