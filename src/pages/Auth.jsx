import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import logo from "../assets/logo-falta1.png";

function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      navigate("/");
    }
    return result;
  };

  const handleRegister = async (formData) => {
    const result = await register(
      formData.nombre,
      formData.apellido,
      formData.email,
      formData.password
    );
    if (result.success) {
      navigate("/");
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        <img
          src={logo}
          alt="Logo Falta1"
          className="w-16 h-16 mx-auto mb-6 object-contain"
        />

        <div className="flex justify-center mb-8 border-b">
          <button
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "login"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Iniciar sesión
          </button>
          <button
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "register"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Registrarse
          </button>
        </div>

        {activeTab === "login" ? (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setActiveTab("register")}
          />
        ) : (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => setActiveTab("login")}
          />
        )}
      </div>
    </div>
  );
}

export default Auth;
