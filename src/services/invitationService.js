import api from "./api";

export const invitationService = {
  async getInvitations() {
    try {
      console.log("🔍 InvitationService: Solicitando invitaciones...");
      const response = await api.get("/invitations");

      console.log("✅ InvitationService: Invitaciones recibidas:", {
        count: response.data?.length || 0,
        data: response.data,
      });

      return response.data;
    } catch (error) {
      console.error("❌ InvitationService: Error obteniendo invitaciones:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          withCredentials: error.config?.withCredentials,
        },
      });

      if (error.response?.status === 404) {
        console.log(
          "📭 InvitationService: No hay invitaciones pendientes (404)"
        );
        return [];
      }

      if (error.response?.status === 401) {
        console.warn("🔐 InvitationService: Token expirado o no válido (401)");
      }

      if (error.message.includes("Network Error")) {
        console.error(
          "🌐 InvitationService: Error de red - Verifica conexión con el servidor"
        );
      }

      return [];
    }
  },

  async sendInvitation(invitedUserId) {
    try {
      console.log(
        "📤 InvitationService: Enviando invitación a usuario ID:",
        invitedUserId
      );

      const response = await api.post("/invitations", {
        invitadoId: invitedUserId,
      });

      console.log(
        "✅ InvitationService: Invitación enviada exitosamente:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error("❌ InvitationService: Error al enviar invitación:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al enviar invitación";
      if (error.response?.status === 400) {
        if (error.response?.data?.message?.includes("ya pertenece")) {
          errorMessage = "El usuario ya pertenece a un equipo";
        } else if (error.response?.data?.message?.includes("no visible")) {
          errorMessage = "El usuario no tiene su perfil visible";
        } else if (error.response?.data?.message?.includes("ya existente")) {
          errorMessage = "Ya has enviado una invitación a este usuario";
        }
      }

      if (error.response?.status === 404) {
        errorMessage = "Usuario no encontrado";
      }

      if (error.response?.status === 403) {
        errorMessage = "No tienes permisos para enviar invitaciones";
      }

      throw new Error(errorMessage);
    }
  },

  async acceptInvitation(invitationId) {
    try {
      console.log(
        "✅ InvitationService: Aceptando invitación ID:",
        invitationId
      );

      const response = await api.put(`/invitations/accept/${invitationId}`);

      console.log("🎉 InvitationService: Invitación aceptada:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ InvitationService: Error al aceptar invitación:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errorMessage =
        error.response?.data?.message || "Error al aceptar invitación";

      if (error.response?.status === 400) {
        if (error.response?.data?.message?.includes("No puedes aceptar")) {
          errorMessage = "No puedes aceptar esta invitación";
        } else if (
          error.response?.data?.message?.includes("limite de jugadores")
        ) {
          errorMessage = "El equipo ha alcanzado el límite de jugadores";
        }
      }

      if (error.response?.status === 404) {
        errorMessage = "Invitación no encontrada";
      }

      throw new Error(errorMessage);
    }
  },

  async rejectInvitation(invitationId) {
    try {
      console.log(
        "❌ InvitationService: Rechazando invitación ID:",
        invitationId
      );

      const response = await api.put(`/invitations/reject/${invitationId}`);

      console.log("📭 InvitationService: Invitación rechazada:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ InvitationService: Error al rechazar invitación:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errorMessage =
        error.response?.data?.message || "Error al rechazar invitación";

      if (error.response?.status === 404) {
        errorMessage = "Invitación no encontrada";
      }

      throw new Error(errorMessage);
    }
  },

  async debugConnection() {
    try {
      console.log("🔧 InvitationService: Probando conexión con el backend...");

      const response = await api.get("/invitations", {
        timeout: 5000,
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 404;
        },
      });

      console.log(
        "🔧 InvitationService: Conexión exitosa. Status:",
        response.status
      );
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      console.error("🔧 InvitationService: Error de conexión:", error.message);
      return {
        success: false,
        error: error.message,
        details: {
          isNetworkError: error.message.includes("Network Error"),
          isTimeout: error.code === "ECONNABORTED",
          config: error.config,
        },
      };
    }
  },
};
