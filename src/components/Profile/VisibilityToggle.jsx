import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userSearchService } from "../../services/userSearchService";

function VisibilityToggle({ compact = false }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const canChangeVisibility = user?.rol === "usuario";

  const handleToggleVisibility = async () => {
    if (!canChangeVisibility) {
      setMessage("Solo usuarios sin equipo pueden cambiar su visibilidad");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const action = user.visible ? "ocultar" : "mostrar";
    if (
      !window.confirm(
        `¿${user.visible ? "Ocultar" : "Mostrar"} tu perfil?\n\n` +
          `Si ocultas tu perfil, no podrás recibir invitaciones de otros equipos.\n` +
          `Si muestras tu perfil, otros capitanes podrán invitarte a sus equipos.`
      )
    ) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await userSearchService.changeVisibility();

      const successMessage =
        result.message || result.mesagge || "Visibilidad actualizada";
      setMessage(successMessage);

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!canChangeVisibility && compact) {
    return null;
  }

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={handleToggleVisibility}
          disabled={isLoading}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            user.visible
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          } disabled:opacity-50`}
          title={
            user.visible
              ? "Perfil visible - Click para ocultar"
              : "Perfil oculto - Click para mostrar"
          }
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
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
          ) : user.visible ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          )}
          <span>{user.visible ? "Visible" : "Oculto"}</span>
        </button>

        {message && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 text-white text-xs rounded-lg p-2 z-50">
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">
            Visibilidad del perfil
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {user.visible
              ? "✅ Tu perfil es visible. Otros capitanes pueden invitarte a sus equipos."
              : "❌ Tu perfil está oculto. No recibirás invitaciones de otros equipos."}
          </p>
          {message && (
            <p
              className={`text-sm mt-2 ${
                message.includes("Error") ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
        <button
          onClick={handleToggleVisibility}
          disabled={isLoading || !canChangeVisibility}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            user.visible
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : "bg-green-100 text-green-800 hover:bg-green-200"
          } ${
            !canChangeVisibility ? "opacity-50 cursor-not-allowed" : ""
          } disabled:opacity-50`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
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
              Procesando...
            </span>
          ) : user.visible ? (
            "Ocultar perfil"
          ) : (
            "Mostrar perfil"
          )}
        </button>
      </div>

      {!canChangeVisibility && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Nota:</strong> Solo los usuarios sin equipo pueden cambiar
            su visibilidad. Si ya eres jugador o capitán, tu perfil se oculta
            automáticamente.
          </p>
        </div>
      )}
    </div>
  );
}

export default VisibilityToggle;
