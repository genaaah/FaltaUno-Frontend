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

  const switchToLogin = () => {
    setActiveTab("login");
    setRegistrationSuccess(false);
  };

  const switchToRegister = () => {
    setActiveTab("register");
    setRegistrationSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 mx-3 sm:mx-4">
        <div className="mb-5 sm:mb-6 md:mb-8 flex justify-center">
          <img
            src={logo}
            alt="Logo Falta1"
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
          />
        </div>

        {registrationSuccess && (
          <div className="mb-5 sm:mb-6 md:mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 sm:p-4 animate-fade-in">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-green-600"
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
                </div>
              </div>
              <div>
                <p className="font-semibold text-green-800 text-sm sm:text-base">
                  ¡Registro exitoso!
                </p>
                <p className="text-xs sm:text-sm text-green-700 mt-1 leading-relaxed">
                  Hemos enviado un correo de verificación a{" "}
                  <span className="font-medium">{registeredEmail}</span>. Revisa
                  tu bandeja de entrada y haz clic en el enlace para activar tu
                  cuenta.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-5 sm:mb-6 md:mb-8 border-b border-gray-200">
          <div className="flex justify-center gap-1 sm:gap-2">
            <button
              className={`flex-1 sm:flex-none sm:px-6 py-2.5 sm:py-3 font-semibold text-sm sm:text-base border-b-2 transition-all duration-300 ${
                activeTab === "login"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={switchToLogin}
            >
              Iniciar sesión
            </button>
            <button
              className={`flex-1 sm:flex-none sm:px-6 py-2.5 sm:py-3 font-semibold text-sm sm:text-base border-b-2 transition-all duration-300 ${
                activeTab === "register"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={switchToRegister}
            >
              Registrarse
            </button>
          </div>
        </div>

        <div className="animate-fade-in">
          {activeTab === "login" ? (
            <Login
              onLogin={handleLogin}
              onSwitchToRegister={switchToRegister}
            />
          ) : (
            <Register
              onRegister={handleRegister}
              onSwitchToLogin={switchToLogin}
            />
          )}
        </div>

        <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={() => navigate("/")}
            className="w-full text-center text-gray-500 hover:text-gray-700 text-xs sm:text-sm transition-colors duration-200"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
