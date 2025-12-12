import api from "./api";

export const matchesService = {
  async createMatch(matchData) {
    try {
      console.log("🎯 MatchesService: Creando partido...", matchData);
      const response = await api.post("/matches", matchData);
      console.log("✅ Partido creado:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear partido:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errorMessage = "Error al crear partido";

      if (error.response?.status === 400) {
        const backendMessage = error.response.data?.message || "";
        if (backendMessage.includes("No puedes crear un partido contra ti")) {
          errorMessage = "No puedes crear un partido contra tu propio equipo";
        } else if (backendMessage.includes("Ya existe un partido")) {
          errorMessage = "Ya existe un partido a esa hora en esa cancha";
        }
      } else if (error.response?.status === 401) {
        errorMessage = "No tienes permisos para crear partidos";
      } else if (error.response?.status === 403) {
        errorMessage = "Solo los capitanes pueden crear partidos";
      }

      throw new Error(errorMessage);
    }
  },

  async getAllMatches() {
    try {
      console.log("🔍 MatchesService: Obteniendo todos los partidos...");
      const response = await api.get("/matches");

      if (response.data?.[0]) {
        console.log("🔍 DEBUG - Estructura del primer partido:", {
          equipos: response.data[0].equipos,
          cancha: response.data[0].cancha,
          estado_resultado: response.data[0].estado_resultado,
        });
      }

      console.log("✅ Partidos obtenidos:", response.data?.length || 0);
      return response.data || [];
    } catch (error) {
      console.error("❌ Error al obtener partidos:", error.message);

      if (error.response?.status === 404) {
        console.log("📭 No hay partidos disponibles");
        return [];
      }

      return [];
    }
  },

  async getMyMatches() {
    try {
      console.log("🔍 MatchesService: Obteniendo mis partidos...");
      const response = await api.get("/matches/me");
      console.log("✅ Mis partidos obtenidos:", response.data?.length || 0);
      return response.data || [];
    } catch (error) {
      console.error("❌ Error al obtener mis partidos:", error.message);

      if (error.response?.status === 404) {
        console.log("📭 No tienes partidos programados");
        return [];
      }

      return [];
    }
  },

  async getMatchById(id) {
    try {
      console.log(`🔍 MatchesService: Obteniendo partido ID ${id}...`);
      const response = await api.get(`/matches/${id}`);
      console.log("✅ Partido obtenido:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener partido:", error.message);
      throw new Error(
        error.response?.data?.message || "Error al obtener partido"
      );
    }
  },

  async updateMatch(id, matchData) {
    try {
      console.log(
        `🔄 MatchesService: Actualizando partido ID ${id}...`,
        matchData
      );
      const response = await api.put(`/matches/${id}`, matchData);
      console.log("✅ Partido actualizado:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar partido:", error.message);
      throw new Error(
        error.response?.data?.message || "Error al actualizar partido"
      );
    }
  },

  async deleteMatch(id) {
    try {
      console.log(`🗑️ MatchesService: Eliminando partido ID ${id}...`);
      const response = await api.delete(`/matches/${id}`);
      console.log("✅ Partido eliminado:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar partido:", error.message);
      throw new Error(
        error.response?.data?.message || "Error al eliminar partido"
      );
    }
  },

  async joinMatch(id) {
    try {
      console.log(`🤝 MatchesService: Uniéndose al partido ID ${id}...`);
      const response = await api.patch(`/matches/join/${id}`);
      console.log("✅ Unido al partido:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al unirse al partido:", error.message);
      throw new Error(
        error.response?.data?.message || "Error al unirse al partido"
      );
    }
  },

  async leaveMatch(id) {
    try {
      console.log(`🚪 MatchesService: Saliendo del partido ID ${id}...`);
      const response = await api.patch(`/matches/leave/${id}`);
      console.log("✅ Salido del partido:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al salir del partido:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errorMessage = "Error al salir del partido";

      if (error.response?.status === 400) {
        const backendMessage = error.response.data?.message || "";
        if (
          backendMessage.includes(
            "No puedes salir del partido si no tenes rival"
          )
        ) {
          errorMessage =
            "No puedes abandonar el partido si no tienes rival. En su lugar, elimina el partido.";
        } else if (
          backendMessage.includes("Hubo un error al salir del partido")
        ) {
          errorMessage =
            "Ocurrió un error al intentar salir del partido. Intenta nuevamente.";
        }
      } else if (error.response?.status === 401) {
        errorMessage = "No tienes permisos para realizar esta acción";
      } else if (error.response?.status === 403) {
        errorMessage = "Solo los capitanes pueden abandonar el partido";
      }

      throw new Error(errorMessage);
    }
  },

  async updateResult(id, resultData) {
    try {
      console.log(
        `📊 MatchesService: Actualizando resultado ID ${id}...`,
        resultData
      );
      const response = await api.put(`/matches/result/${id}`, resultData);
      console.log("✅ Resultado actualizado:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar resultado:", error.message);
      throw new Error(
        error.response?.data?.message || "Error al actualizar resultado"
      );
    }
  },

  async confirmResult(id) {
    try {
      console.log(`✅ MatchesService: Confirmando resultado ID ${id}...`);
      const response = await api.patch(`/matches/result/confirm/${id}`);
      console.log("✅ Resultado confirmado:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al confirmar resultado:", error.message);
      throw new Error(
        error.response?.data?.message || "Error al confirmar resultado"
      );
    }
  },

  async rejectResult(id) {
    try {
      console.log(`❌ MatchesService: Rechazando resultado ID ${id}...`);
      const response = await api.patch(`/matches/result/reject/${id}`);
      console.log("✅ Resultado rechazado:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al rechazar resultado:", error.message);
      throw new Error(
        error.response?.data?.message || "Error al rechazar resultado"
      );
    }
  },

  transformMatchData(match) {
    console.log("🔄 Transformando datos del partido:", match.id);

    const date = match.hora_dia ? new Date(match.hora_dia) : null;

    console.log("🔍 Equipos del partido:", match.equipos);

    const localTeam = match.equipos?.find((team) => team.equipo?.es_local);
    const visitorTeam = match.equipos?.find((team) => !team.equipo?.es_local);

    console.log("🔍 Datos del equipo local:", {
      equipo: localTeam?.equipo,
      creador: localTeam?.equipo?.creador,
    });

    console.log("🔍 Datos del equipo visitante:", {
      equipo: visitorTeam?.equipo,
      creador: visitorTeam?.equipo?.creador,
    });

    return {
      id: match.id,
      fecha: date
        ? date.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "No definida",
      hora: date
        ? date.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      fechaCompleta: date,
      cancha: match.cancha?.nombre || "No definida",
      canchaId: match.cancha?.id,
      estado: match.estado_resultado,

      equipoLocal: localTeam?.equipo?.nombre || "Disponible",
      equipoLocalId: localTeam?.equipo?.id,
      golesLocal: localTeam?.equipo?.goles,
      creadorLocalId: localTeam?.equipo?.creador?.id,
      creadorLocalNombre: localTeam?.equipo?.creador?.nombre,
      creadorLocalApellido: localTeam?.equipo?.creador?.apellido,

      equipoVisitante: visitorTeam?.equipo?.nombre || "Disponible",
      equipoVisitanteId: visitorTeam?.equipo?.id,
      golesVisitante: visitorTeam?.equipo?.goles,
      creadorVisitanteId: visitorTeam?.equipo?.creador?.id,
      creadorVisitanteNombre: visitorTeam?.equipo?.creador?.nombre,
      creadorVisitanteApellido: visitorTeam?.equipo?.creador?.apellido,

      equipos: match.equipos || [],
      creadoEn: match.creadoEn,
      actualizadoEn: match.actualizadoEn,
    };
  },

  formatForForm(match) {
    const date = match.hora_dia ? new Date(match.hora_dia) : null;

    return {
      hora_dia: date ? date.toISOString().slice(0, 16) : "",
      partido: {
        canchaId: match.cancha?.id || "",
        contrincante:
          match.equipos?.find((team) => !team.es_local)?.equipo?.id || "",
      },
    };
  },
};
