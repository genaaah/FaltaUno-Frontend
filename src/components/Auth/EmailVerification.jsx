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

        // IMPORTANTE: Pasamos el token como parámetro
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
          setDetails("El token ha expirado. Solicita un nuevo enlace de verificación.");
        } else if (error.message.includes("no válido")) {
          setDetails("El token no es válido.");
        } else {
          setDetails(error.message || "Error desconocido.");
        }
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <div
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              status === "verificando"
                ? "bg-blue-100 text-blue-600"
                : status === "success"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {status === "verificando" ? (
              <svg
                className="w-8 h-8 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : status === "success" ? (
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
            ) : (
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
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {status === "verificando" && "Verificando tu cuenta..."}
          {status === "success" && "¡Verificación exitosa!"}
          {status === "error" && "Error de verificación"}
        </h2>

        <p className="text-gray-600 mb-2">{message}</p>
        {details && <p className="text-sm text-gray-500 mb-6">{details}</p>}

        {status === "verificando" && (
          <p className="text-sm text-gray-500 animate-pulse">
            Por favor espera...
          </p>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                Serás redirigido automáticamente en 3 segundos...
              </p>
            </div>
            <button
              onClick={() => navigate("/verificacion-exitosa")}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">
                {details || "Error al verificar la cuenta."}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/auth")}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Ir al inicio de sesión
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {status !== "error" && (
          <button
            onClick={() => navigate("/auth")}
            className="mt-4 text-green-600 hover:text-green-800 font-semibold text-sm"
          >
            Ir al inicio de sesión
          </button>
        )}
      </div>
    </div>
  );
}

export default EmailVerification;