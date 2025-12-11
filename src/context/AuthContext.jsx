import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (isCheckingAuth) return;

    setIsCheckingAuth(true);

    try {
      console.log("🔍 Verificando sesión...");
      const userProfile = await authService.getProfile();
      console.log("✅ Usuario autenticado:", userProfile.email);
      setUser(userProfile);
    } catch (error) {
      console.log("👤 No hay sesión activa o expiró");
      setUser(null);

      if (
        error.message.includes("Sesión expirada") &&
        document.cookie.includes("accessToken")
      ) {
        console.log("🔄 Limpiando cookie expirada...");
        document.cookie =
          "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    } finally {
      setLoading(false);
      setIsCheckingAuth(false);
    }
  };

  const refreshUser = async () => {
    try {
      const userProfile = await authService.refreshUserData();
      setUser(userProfile);
      return userProfile;
    } catch (error) {
      console.error("Error al refrescar usuario:", error);
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      return { success: true, data: userData };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (nombre, apellido, email, documento, password) => {
    try {
      console.log("📤 Datos enviados al registro:", {
        nombre,
        apellido,
        email,
        documento,
        passwordLength: password.length,
      });

      const userData = {
        nombre,
        apellido,
        email,
        documento,
        password,
      };

      const result = await authService.register(userData);

      console.log("✅ Respuesta del registro:", result);
      return result;
    } catch (error) {
      console.error("❌ Error en registro:", error.message);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setUser(null);
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  };

  const updateUserTeam = (teamId, teamName, playerCount = 1) => {
    setUser((prev) => ({
      ...prev,
      equipoId: teamId,
      equipo: teamName
        ? {
            id: teamId,
            nombre: teamName,
            cantidad_jugadores: playerCount,
          }
        : null,
    }));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUserTeam,
    refreshUser,
    loading,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
