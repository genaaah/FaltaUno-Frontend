import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userProfile = await authService.getProfile();
      setUser(userProfile);
    } catch (error) {
      console.log("No hay sesión activa:", error.message);
      setUser(null);
    } finally {
      setLoading(false);
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

  const register = async (nombre, apellido, email, password) => {
    try {
      const userData = {
        nombre,
        apellido,
        email,
        password,
      };

      await authService.register(userData);

      const loginResult = await login(email, password);
      return loginResult;
    } catch (error) {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
