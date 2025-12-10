import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { teamService } from "../../services/teamService";
import { sweetAlert } from "../../utils/sweetAlert";

function CreateTeamModal({ isOpen, onClose, hasTeam, currentTeamName }) {
  const { user, updateUserTeam, refreshUser } = useAuth();
  const [teamName, setTeamName] = useState(currentTeamName || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");
  const [availableTeams, setAvailableTeams] = useState([]);
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableTeams();
      setTeamName(currentTeamName || "");
      setError("");
      setIsDuplicate(false);
    }
  }, [isOpen, currentTeamName]);

  const fetchAvailableTeams = async () => {
    try {
      const teams = await teamService.getAllTeams();
      setAvailableTeams(teams || []);
    } catch (error) {
      setAvailableTeams([]);
    }
  };

  const checkDuplicateName = async (name) => {
    if (!name.trim() || name.trim() === currentTeamName) {
      setIsDuplicate(false);
      return false;
    }

    setIsChecking(true);
    try {
      const isDuplicateLocal = availableTeams.some(
        (team) =>
          team.nombre.toLowerCase().trim() === name.toLowerCase().trim() &&
          team.id !== user?.equipoId
      );

      if (isDuplicateLocal) {
        setIsDuplicate(true);
        setError("Nombre de equipo ya en uso");
        return true;
      }

      setIsDuplicate(false);
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const handleNameChange = async (e) => {
    const newName = e.target.value;
    setTeamName(newName);
    setError("");

    if (newName.trim().length > 0) {
      if (newName.trim().length > 75) {
        setError("Máximo 75 caracteres");
        return;
      }

      if (newName.trim() !== currentTeamName) {
        await checkDuplicateName(newName);
      }
    }
  };

  const validateTeamName = () => {
    if (!teamName.trim()) {
      setError("Nombre requerido");
      return false;
    }

    if (teamName.trim().length < 3) {
      setError("Mínimo 3 caracteres");
      return false;
    }

    if (teamName.trim().length > 75) {
      setError("Máximo 75 caracteres");
      return false;
    }

    if (isDuplicate) {
      setError("Nombre ya en uso");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateTeamName()) {
      return;
    }

    const finalCheck = await checkDuplicateName(teamName);
    if (finalCheck) {
      return;
    }

    const action = hasTeam ? "actualizar" : "crear";
    const confirmMessage = hasTeam
      ? `¿Cambiar nombre a "${teamName.trim()}"?`
      : `¿Crear equipo "${teamName.trim()}"? Serás el capitán.`;

    const confirmResult = await sweetAlert.confirm(
      hasTeam ? "Actualizar equipo" : "Crear equipo",
      confirmMessage,
      hasTeam ? "Actualizar" : "Crear",
      "Cancelar"
    );

    if (!confirmResult.isConfirmed) {
      return;
    }

    setIsLoading(true);

    try {
      if (hasTeam) {
        await teamService.updateTeam(teamName.trim());
        updateUserTeam(user.equipoId, teamName.trim());

        await sweetAlert.success(
          "¡Equipo actualizado!",
          `Ahora se llama "${teamName.trim()}"`
        );
      } else {
        const newTeam = await teamService.createTeam(teamName.trim());
        updateUserTeam(newTeam.id, teamName.trim());

        await sweetAlert.success(
          "¡Equipo creado!",
          `"${teamName.trim()}" creado exitosamente`
        );
      }

      await refreshUser();
      onClose();
    } catch (error) {
      const errorMessage =
        error.userMessage || error.message || "Error al procesar";

      if (
        errorMessage.includes("Nombre ingresado ya en uso") ||
        errorMessage.includes("ya está en uso")
      ) {
        setError("Nombre ya en uso");
        setIsDuplicate(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    const confirmResult = await sweetAlert.confirmCritical(
      "¿Eliminar equipo?",
      `Esta acción es IRREVERSIBLE.\n¿Eliminar "${currentTeamName}"?`,
      "Eliminar",
      "Cancelar"
    );

    if (!confirmResult.isConfirmed) {
      return;
    }

    const { value: typedText } = await sweetAlert.confirmWithInput(
      "Confirmación final",
      `Escribe "ELIMINAR" para confirmar:`,
      'Escribe "ELIMINAR" aquí...',
      "Confirmar eliminación",
      "Cancelar"
    );

    if (typedText !== "ELIMINAR") {
      return;
    }

    setIsLoading(true);
    try {
      await teamService.deleteTeam();
      updateUserTeam(null, null);

      await sweetAlert.success(
        "Equipo eliminado",
        `"${currentTeamName}" ha sido eliminado`
      );

      await refreshUser();
      onClose();
    } catch (error) {
      const errorMessage =
        error.userMessage || error.message || "Error al eliminar";
      await sweetAlert.error("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
              disabled={isLoading}
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
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={teamName}
                  onChange={handleNameChange}
                  placeholder="Ej: Los Campeones FC"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    error ? "border-red-400" : "border-gray-300"
                  } ${isChecking ? "pr-10" : ""}`}
                  maxLength={75}
                  disabled={isLoading}
                  required
                />
                {isChecking && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">
                  {teamName.length}/75 caracteres
                </p>
                {isDuplicate && (
                  <p className="text-xs text-red-600 font-medium">
                    ⚠️ Nombre no disponible
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={
                  isLoading || isChecking || isDuplicate || !teamName.trim()
                }
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-h-[44px]"
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
                  "Actualizar"
                ) : (
                  "Crear"
                )}
              </button>

              {hasTeam && (
                <button
                  type="button"
                  onClick={handleDeleteTeam}
                  disabled={isLoading}
                  className="px-6 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-h-[44px]"
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
            <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-600"
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
              Información
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Solo el capitán puede gestionar</li>
              <li>• Nombres deben ser únicos</li>
              <li>• Máximo 5 jugadores</li>
              <li>• Eliminar equipo borra todos los datos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTeamModal;
