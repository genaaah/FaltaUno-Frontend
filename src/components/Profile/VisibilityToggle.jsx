import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userSearchService } from "../../services/userSearchService";
import { sweetAlert } from "../../utils/sweetAlert";

function VisibilityToggle({ compact = false }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const canChangeVisibility = user?.rol === "usuario";

  const handleToggleVisibility = async () => {
    if (!canChangeVisibility) {
      await sweetAlert.warning(
        "No permitido",
        "Solo usuarios sin equipo pueden cambiar visibilidad"
      );
      return;
    }

    const action = user.visible ? "ocultar" : "mostrar";
    const actionText = user.visible ? "Ocultar" : "Mostrar";
    const details = user.visible
      ? "No recibirás invitaciones"
      : "Podrás recibir invitaciones";

    const result = await sweetAlert.confirm(
      `${actionText} perfil`,
      `¿${actionText.toLowerCase()} tu perfil?\n${details}`,
      `Sí, ${action}`,
      "Cancelar"
    );

    if (!result.isConfirmed) {
      return;
    }

    setIsLoading(true);

    try {
      await userSearchService.changeVisibility();

      await sweetAlert.success(
        user.visible ? "Perfil ocultado" : "Perfil visible",
        "Visibilidad actualizada"
      );

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      await sweetAlert.error("Error", error.userMessage || "Error al cambiar");
    } finally {
      setIsLoading(false);
    }
  };

  if (!canChangeVisibility && compact) return null;

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={handleToggleVisibility}
          disabled={isLoading}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center ${
            user.visible
              ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={user.visible ? "Click para ocultar" : "Click para mostrar"}
        >
          {isLoading ? (
            <>
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
              <span>Procesando...</span>
            </>
          ) : user.visible ? (
            <>
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
              <span>Visible</span>
            </>
          ) : (
            <>
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
              <span>Oculto</span>
            </>
          )}
        </button>
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
              ? "✅ Visible - Puedes recibir invitaciones"
              : "❌ Oculto - No recibirás invitaciones"}
          </p>
        </div>
        <button
          onClick={handleToggleVisibility}
          disabled={isLoading || !canChangeVisibility}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 ${
            user.visible
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : "bg-green-100 text-green-800 hover:bg-green-200"
          } ${
            !canChangeVisibility ? "opacity-50 cursor-not-allowed" : ""
          } disabled:opacity-50`}
        >
          {isLoading ? (
            <>
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
            </>
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
            <strong>Nota:</strong> Solo usuarios sin equipo pueden cambiar
            visibilidad.
          </p>
        </div>
      )}
    </div>
  );
}

export default VisibilityToggle;
