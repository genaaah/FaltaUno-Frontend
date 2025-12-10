import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import logo from "../assets/logo-falta1.png";

function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
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
      formData.documento,
      formData.password
    );

    if (result.success) {
      setRegisteredEmail(formData.email);
      setRegistrationSuccess(true);
      setActiveTab("login");
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

        {registrationSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <p className="font-medium text-green-800">¡Registro exitoso!</p>
                <p className="text-sm text-green-700 mt-1">
                  Hemos enviado un correo de verificación a{" "}
                  <strong>{registeredEmail}</strong>. Por favor revisa tu
                  bandeja de entrada y haz clic en el enlace para activar tu
                  cuenta.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mb-8 border-b">
          <button
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "login"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("login");
              setRegistrationSuccess(false);
            }}
          >
            Iniciar sesión
          </button>
          <button
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "register"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("register");
              setRegistrationSuccess(false);
            }}
          >
            Registrarse
          </button>
        </div>

        {activeTab === "login" ? (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => {
              setActiveTab("register");
              setRegistrationSuccess(false);
            }}
          />
        ) : (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => {
              setActiveTab("login");
              setRegistrationSuccess(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Auth;
