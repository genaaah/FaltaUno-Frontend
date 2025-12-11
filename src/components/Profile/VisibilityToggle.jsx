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
        "Solo usuarios sin equipo pueden cambiar la visibilidad de su perfil"
      );
      return;
    }

    const action = user.visible ? "ocultar" : "mostrar";
    const actionText = user.visible ? "Ocultar" : "Mostrar";
    const details = user.visible
      ? "No recibirás invitaciones de equipos"
      : "Podrás recibir invitaciones de equipos";

    const result = await sweetAlert.confirm(
      `${actionText} perfil`,
      `¿${actionText.toLowerCase()} tu perfil?\n\n${details}`,
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
        `Tu perfil ahora está ${user.visible ? "oculto" : "visible"}`
      );

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      await sweetAlert.error(
        "Error",
        error.userMessage || "Error al cambiar la visibilidad"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSpinner = ({ size = "h-4 w-4" }) => (
    <svg
      className={`animate-spin ${size}`}
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
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (compact) {
    return (
      <div className="w-full">
        <button
          onClick={handleToggleVisibility}
          disabled={isLoading || !canChangeVisibility}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border ${
            user.visible
              ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 hover:from-green-100 hover:to-emerald-100 border-green-300"
              : "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 hover:from-gray-100 hover:to-slate-100 border-gray-300"
          } disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500`}
          aria-label={
            user.visible
              ? "Ocultar perfil (actualmente visible)"
              : "Mostrar perfil (actualmente oculto)"
          }
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span>Procesando...</span>
            </>
          ) : user.visible ? (
            <>
              <svg
                className="w-4 h-4 flex-shrink-0"
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
              <span className="truncate">Visible</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 flex-shrink-0"
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
              <span className="truncate">Oculto</span>
            </>
          )}
        </button>

        {!canChangeVisibility && compact && (
          <p className="text-xs text-gray-500 mt-1.5 text-center px-1">
            Solo usuarios sin equipo
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-5 mb-5 sm:mb-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
            Visibilidad del perfil
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
            {user.visible
              ? "✅ Tu perfil es visible y puedes recibir invitaciones de equipos"
              : "❌ Tu perfil está oculto y no recibirás invitaciones"}
          </p>
        </div>

        <button
          onClick={handleToggleVisibility}
          disabled={isLoading || !canChangeVisibility}
          className={`px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 min-w-[140px] ${
            user.visible
              ? "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-800 hover:from-yellow-100 hover:to-amber-100 border border-yellow-300"
              : "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 hover:from-green-100 hover:to-emerald-100 border border-green-300"
          } ${
            !canChangeVisibility ? "opacity-60 cursor-not-allowed" : ""
          } disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500`}
          aria-label={user.visible ? "Ocultar perfil" : "Mostrar perfil"}
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="text-xs sm:text-sm">Procesando...</span>
            </>
          ) : user.visible ? (
            <>
              <svg
                className="w-4 h-4 flex-shrink-0"
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
              <span className="text-xs sm:text-sm">Ocultar perfil</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 flex-shrink-0"
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
              <span className="text-xs sm:text-sm">Mostrar perfil</span>
            </>
          )}
        </button>
      </div>

      {!canChangeVisibility && (
        <div className="mt-3 sm:mt-4 p-3 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
              <strong>Nota:</strong> Solo usuarios sin equipo pueden cambiar la
              visibilidad de su perfil.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VisibilityToggle;
