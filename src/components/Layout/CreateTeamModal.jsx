import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { teamService } from "../../services/teamService";

function CreateTeamModal({ isOpen, onClose, hasTeam, currentTeamName }) {
  const { updateUserTeam } = useAuth();
  const [teamName, setTeamName] = useState(currentTeamName || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!teamName.trim()) {
      setError("El nombre del equipo es requerido");
      return;
    }

    if (teamName.trim().length > 75) {
      setError("El nombre no puede tener más de 75 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      if (hasTeam) {
        await teamService.updateTeam(teamName.trim());
        updateUserTeam(user.equipoId, teamName.trim());
        alert("¡Equipo actualizado correctamente!");
      } else {
        const newTeam = await teamService.createTeam(teamName.trim());
        updateUserTeam(newTeam.id, teamName.trim());
        alert("¡Equipo creado correctamente!");
      }

      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar el equipo "${currentTeamName}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await teamService.deleteTeam();
      updateUserTeam(null, null);
      alert("Equipo eliminado correctamente");
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {hasTeam ? "Gestionar Equipo" : "Crear Equipo"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del equipo
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Ej: Los Campeones FC"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                maxLength={75}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Máximo 75 caracteres</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    {hasTeam ? "Actualizando..." : "Creando..."}
                  </>
                ) : hasTeam ? (
                  "Actualizar Equipo"
                ) : (
                  "Crear Equipo"
                )}
              </button>

              {hasTeam && (
                <button
                  type="button"
                  onClick={handleDeleteTeam}
                  disabled={isLoading}
                  className="px-6 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Eliminar
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2">
              Información del equipo
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Solo el capitán puede gestionar el equipo</li>
              <li>• Para invitar jugadores, necesitas ser capitán</li>
              <li>
                • Al eliminar el equipo, todos los jugadores quedarán sin equipo
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTeamModal;
