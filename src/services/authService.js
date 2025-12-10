import api from "./api";

export const authService = {
  async login(email, password) {
    try {
      console.log("🔐 Intentando login...");

      const response = await api.post("/auth/login", {
        correo_electronico: email,
        contrasena: password,
      });

      console.log("✅ Login exitoso");

      const userData = response.data;

      if (userData && userData.equipo === null) {
        userData.equipo = null;
        userData.equipoId = null;
      } else if (userData.equipo) {
        userData.equipoId = userData.equipo.id;
      }

      return userData;
    } catch (error) {
      console.error("❌ Error en login:", error.response?.data);

      let errorMessage = "Error al iniciar sesión";

      if (error.response?.status === 401) {
        const backendMessage = error.response.data?.message || "";

        if (backendMessage.includes("Debes verificar tu cuenta")) {
          errorMessage =
            "Debes verificar tu cuenta. Revisa tu correo electrónico y haz clic en el enlace de verificación.";
        } else if (backendMessage.includes("Credenciales incorrectas")) {
          errorMessage = "Credenciales incorrectas";
        } else if (backendMessage.includes("Usuario no encontrado")) {
          errorMessage = "Usuario no encontrado";
        } else {
          errorMessage = backendMessage || "Credenciales incorrectas";
        }
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
      console.log("📝 Registrando usuario...");

      const response = await api.post("/auth/register", {
        nombre: userData.nombre,
        apellido: userData.apellido,
        correo_electronico: userData.email,
        documento: userData.documento,
        contrasena: userData.password,
      });

      console.log("✅ Registro exitoso:", response.data);

      return {
        success: true,
        message:
          response.data?.message ||
          "Registro exitoso. Revisa tu correo para verificar tu cuenta.",
        requiresVerification: true,
      };
    } catch (error) {
      console.error("❌ Error en registro:", error.response?.data);

      let errorMessage = "Error al registrar usuario";

      if (error.response?.status === 400) {
        const backendMessage = error.response.data?.message || "";

        if (
          backendMessage.includes("Correo electrónico ingresado ya existente")
        ) {
          errorMessage = "El email ya está registrado";
        } else if (
          backendMessage.includes("Documento ingresado ya existente")
        ) {
          errorMessage = "El documento ya está registrado";
        } else {
          errorMessage = backendMessage || "Datos inválidos";
        }
      }

      throw new Error(errorMessage);
    }
  },

  async logout() {
    try {
      await api.post("/auth/logout");
      console.log("👋 Sesión cerrada");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  },

  async requestPasswordReset(email) {
    try {
      console.log("🔐 Solicitando recuperación de contraseña para:", email);

      const response = await api.post("/auth/send-mail-change-password", {
        correo_electronico: email,
      });

      console.log("✅ Solicitud de recuperación exitosa:", response.data);
      return {
        success: true,
        message: response.data?.message || "Correo de recuperación enviado.",
      };
    } catch (error) {
      console.error("❌ Error solicitando recuperación:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errorMessage = "Error al solicitar recuperación de contraseña";

      if (error.response?.status === 400) {
        const backendMessage = error.response.data?.message || "";
        if (backendMessage.includes("Cuenta no verificada")) {
          errorMessage =
            "Debes verificar tu cuenta primero. Revisa tu email de registro.";
        } else {
          errorMessage = backendMessage || "Email no encontrado o inválido";
        }
      } else if (error.response?.status === 401) {
        errorMessage = "Primero debes verificar tu cuenta";
      }

      throw new Error(errorMessage);
    }
  },

  async resetPassword(token, newPassword, confirmPassword) {
    try {
      console.log(
        "🔐 Cambiando contraseña con token:",
        token?.substring(0, 10) + "..."
      );

      const response = await api.post(`/auth/change-password/${token}`, {
        nueva_contrasena: newPassword,
        confirmar_nueva_contrasena: confirmPassword,
      });

      console.log("✅ Contraseña cambiada exitosamente:", response.data);
      return {
        success: true,
        message: response.data?.message || "Contraseña cambiada exitosamente.",
      };
    } catch (error) {
      console.error("❌ Error cambiando contraseña:", error.response?.data);

      let errorMessage = "Error al cambiar contraseña";

      if (error.response?.status === 400) {
        const backendMessage = error.response.data?.message || "";
        if (backendMessage.includes("Las contraseñas no coinciden")) {
          errorMessage = "Las contraseñas no coinciden";
        } else if (backendMessage.includes("Token no valido")) {
          errorMessage = "El enlace de recuperación no es válido o ha expirado";
        } else if (backendMessage.includes("Token expirado")) {
          errorMessage = "El enlace de recuperación ha expirado";
        } else {
          errorMessage = backendMessage || "Datos inválidos";
        }
      } else if (error.response?.status === 401) {
        errorMessage = "Token inválido o expirado";
      }

      throw new Error(errorMessage);
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

  async verifyEmail(token) {
    try {
      console.log(
        "✅ Verificando email con token:",
        token?.substring(0, 10) + "..."
      );

      const response = await api.post(`/auth/verify-email/${token}`);

      console.log("🎉 Email verificado:", response.data);
      return {
        success: true,
        message: response.data?.message || "Cuenta verificada exitosamente.",
      };
    } catch (error) {
      console.error("❌ Error verificando email:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errorMessage = "Error al verificar tu cuenta.";

      if (error.response?.status === 400) {
        errorMessage =
          error.response.data?.message || "Token inválido o expirado.";
      } else if (error.response?.status === 401) {
        errorMessage = "Token no válido.";
      } else if (error.response?.status === 404) {
        errorMessage = "Endpoint no encontrado. Verifica la URL.";
      }

      throw new Error(errorMessage);
    }
  },

  async refreshUserData() {
    return this.getProfile();
  },
};
