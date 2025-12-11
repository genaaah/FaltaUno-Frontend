import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";

function EmailVerification() {
  const [status, setStatus] = useState("verificando");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");

        if (!token) {
          setStatus("error");
          setMessage("Token de verificación no proporcionado.");
          setDetails("El enlace de verificación está incompleto.");
          return;
        }

        console.log("🔐 Token recibido:", token.substring(0, 20) + "...");

        const result = await authService.verifyEmail(token);

        setStatus("success");
        setMessage(result.message);
        setDetails(
          "Tu cuenta ha sido activada correctamente. Ahora puedes iniciar sesión."
        );

        setTimeout(() => {
          navigate("/verificacion-exitosa");
        }, 3000);
      } catch (error) {
        console.error("Error verificando email:", error);

        setStatus("error");
        setMessage("Error al verificar tu cuenta.");

        if (error.message.includes("Token inválido")) {
          setDetails("El token es inválido o ya ha sido usado.");
        } else if (error.message.includes("expirado")) {
          setDetails(
            "El token ha expirado. Solicita un nuevo enlace de verificación."
          );
        } else if (error.message.includes("no válido")) {
          setDetails("El token no es válido.");
        } else {
          setDetails(error.message || "Error desconocido.");
        }
      }
    };

    verifyEmail();
  }, [location, navigate]);

  const statusConfig = {
    verificando: {
      icon: (
        <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ),
      title: "Verificando tu cuenta...",
      colorClasses: "bg-blue-100 text-blue-600",
    },
    success: {
      icon: (
        <svg
          className="w-8 h-8"
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
      ),
      title: "¡Verificación exitosa!",
      colorClasses: "bg-green-100 text-green-600",
    },
    error: {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
      title: "Error de verificación",
      colorClasses: "bg-red-100 text-red-600",
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-auto">
        <div className="mb-6 sm:mb-8">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center ${currentStatus.colorClasses}`}
          >
            {currentStatus.icon}
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">
          {currentStatus.title}
        </h2>
        <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          <p className="text-gray-600 text-sm sm:text-base text-center">
            {message}
          </p>
          {details && (
            <p className="text-xs sm:text-sm text-gray-500 text-center leading-relaxed">
              {details}
            </p>
          )}
        </div>
        {status === "verificando" && (
          <p className="text-sm text-gray-500 text-center animate-pulse">
            Por favor espera...
          </p>
        )}
        {status === "success" && (
          <div className="space-y-4 sm:space-y-5">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-xs sm:text-sm text-green-700 text-center">
                Serás redirigido automáticamente en 3 segundos...
              </p>
            </div>
            <button
              onClick={() => navigate("/verificacion-exitosa")}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
            >
              Continuar
            </button>
          </div>
        )}
        {status === "error" && (
          <div className="space-y-4 sm:space-y-5">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-xs sm:text-sm text-red-700 text-center">
                {details || "Error al verificar la cuenta."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/auth")}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Ir al inicio de sesión
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 sm:px-6 bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 border border-gray-300"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}
        {status !== "error" && (
          <button
            onClick={() => navigate("/auth")}
            className="hidden sm:block mt-6 text-green-600 hover:text-green-800 font-semibold text-sm transition-colors duration-300 mx-auto"
          >
            Ir al inicio de sesión
          </button>
        )}
      </div>
    </div>
  );
}

export default EmailVerification;
