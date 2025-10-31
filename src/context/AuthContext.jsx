import React, { createContext, useContext, useState, useEffect } from "react";
import usersData from "../data/users.json";
import matchesData from "../data/matches.json";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("allUsers")) {
      localStorage.setItem("allUsers", JSON.stringify(usersData));
    }
    if (!localStorage.getItem("matches")) {
      localStorage.setItem("matches", JSON.stringify(matchesData));
    }

    const storedUser = localStorage.getItem("userLogged");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    const user = allUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const { password: _, ...safeUser } = user;
      setUser(safeUser);
      localStorage.setItem("userLogged", JSON.stringify(safeUser));
      return true;
    }
    return false;
  };

  const register = (name, email, password) => {
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");

    if (allUsers.find((u) => u.email === email)) {
      alert("❌ El usuario ya existe");
      return false;
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
      team_name: "Sin equipo",
      team_shield:
        "https://via.placeholder.com/150/007e33/ffffff?text=SIN+EQUIPO",
    };

    allUsers.push(newUser);
    localStorage.setItem("allUsers", JSON.stringify(allUsers));

    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem("userLogged", JSON.stringify(safeUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userLogged");
  };

  const updateUserTeam = (teamName, teamShield) => {
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    const updatedUsers = allUsers.map((u) =>
      u.id === user.id
        ? { ...u, team_name: teamName, team_shield: teamShield }
        : u
    );

    localStorage.setItem("allUsers", JSON.stringify(updatedUsers));

    const updatedUser = {
      ...user,
      team_name: teamName,
      team_shield: teamShield,
    };
    setUser(updatedUser);
    localStorage.setItem("userLogged", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUserTeam,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
