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

  const LoadingSpinner = ({ size = "h-5 w-5", color = "border-green-600" }) => (
    <div
      className={`animate-spin rounded-full border-b-2 ${size} ${color}`}
    ></div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-3 sm:mx-4">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-start gap-4 mb-4 sm:mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                {hasTeam ? "Gestionar Equipo" : "Crear Equipo"}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                {hasTeam
                  ? "Actualiza o elimina tu equipo"
                  : "Crea un nuevo equipo y conviértete en capitán"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
              disabled={isLoading}
              aria-label="Cerrar modal"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
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
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Nombre del equipo
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={teamName}
                  onChange={handleNameChange}
                  placeholder="Ej: Los Campeones FC"
                  className={`w-full px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                    error ? "border-red-400" : "border-gray-300"
                  } ${isChecking ? "pr-10" : ""} ${
                    isLoading ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                  maxLength={75}
                  disabled={isLoading}
                  required
                />
                {isChecking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <LoadingSpinner size="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-1.5">
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
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
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
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
              <button
                type="submit"
                disabled={
                  isLoading || isChecking || isDuplicate || !teamName.trim()
                }
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-green-600 disabled:hover:to-emerald-600 flex items-center justify-center gap-2 min-h-[44px] shadow-md hover:shadow-lg active:scale-[0.98]"
                aria-label={hasTeam ? "Actualizar equipo" : "Crear equipo"}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner color="border-white" />
                    <span className="text-sm sm:text-base">
                      {hasTeam ? "Actualizando..." : "Creando..."}
                    </span>
                  </>
                ) : hasTeam ? (
                  <>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
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
                    <span className="text-sm sm:text-base">Actualizar</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="text-sm sm:text-base">Crear</span>
                  </>
                )}
              </button>

              {hasTeam && (
                <button
                  type="button"
                  onClick={handleDeleteTeam}
                  disabled={isLoading}
                  className="px-4 sm:px-6 bg-gradient-to-r from-red-600 to-rose-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-red-700 hover:to-rose-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] shadow-md hover:shadow-lg active:scale-[0.98]"
                  aria-label="Eliminar equipo"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
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
                  <span className="text-sm sm:text-base hidden xs:inline">
                    Eliminar
                  </span>
                </button>
              )}
            </div>
          </form>
          <div className="mt-5 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              Información importante
            </h4>
            <ul className="text-xs sm:text-sm text-gray-600 space-y-1.5 sm:space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Solo el capitán puede gestionar el equipo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Los nombres de equipo deben ser únicos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Máximo 5 jugadores por equipo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>
                  Eliminar equipo borra todos los datos permanentemente
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTeamModal;
