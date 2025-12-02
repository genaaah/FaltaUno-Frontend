import api from "./api";

export const teamService = {
  async createTeam(teamName) {
    try {
      const response = await api.post("/teams", {
        nombre: teamName,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al crear equipo";
      throw new Error(errorMessage);
    }
  },

  async getAllTeams() {
    try {
      const response = await api.get("/teams");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al obtener equipos"
      );
    }
  },

  async getTeamById(id) {
    try {
      const response = await api.get(`/teams/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al obtener equipo"
      );
    }
  },

  async updateTeam(teamName) {
    try {
      const response = await api.put("/teams", {
        nombre: teamName,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al actualizar equipo";
      throw new Error(errorMessage);
    }
  },

  async deleteTeam() {
    try {
      const response = await api.delete("/teams");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al eliminar equipo";
      throw new Error(errorMessage);
    }
  },
};
