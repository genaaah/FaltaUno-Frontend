import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { matchesService } from "../../services/matchesService";
import { sweetAlert } from "../../utils/sweetAlert";

function MatchCard({ match, onUpdate, isMyMatch = false }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  const [resultData, setResultData] = useState({
    goles_local: match.golesLocal || 0,
    goles_visitante: match.golesVisitante || 0,
  });

  const isCreator = match.creadorLocalId === user?.id;
  const isVisitorCaptain = match.creadorVisitanteId === user?.id;

  const canJoin =
    !match.equipoVisitanteId &&
    user?.rol === "capitan" &&
    user?.equipoId !== match.equipoVisitanteId;

  const canLeave =
    isVisitorCaptain &&
    match.estado === "sin_cargar" &&
    user?.equipoId === match.equipoVisitanteId;

  const canUpdateResult =
    isCreator && match.estado === "sin_cargar" && match.equipoVisitanteId;

  const canConfirmResult =
    isVisitorCaptain && match.estado === "confirmacion_pendiente";

  const canRejectResult = isVisitorCaptain && match.estado === "confirmacion_pendiente";

  const handleJoin = async () => {
    if (!user?.equipoId) {
      await sweetAlert.error(
        "Sin equipo",
        "Necesitas tener un equipo para unirte a un partido"
      );
      return;
    }

    if (user?.equipoId === match.equipoLocalId) {
      await sweetAlert.error(
        "No puedes unirte",
        "No puedes unirte a un partido de tu propio equipo"
      );
      return;
    }

    const confirmResult = await sweetAlert.confirm(
      "¿Unirse al partido?",
      `¿Unir tu equipo "${user?.equipo?.nombre}" al partido contra ${match.equipoLocal}?\n\nFecha: ${match.fecha}\nHora: ${match.hora}\nCancha: ${match.cancha}`,
      "Sí, unirse",
      "Cancelar"
    );

    if (!confirmResult.isConfirmed) return;

    setIsLoading(true);
    try {
      await matchesService.joinMatch(match.id);
      await sweetAlert.success(
        "¡Te has unido!",
        `Ahora formas parte del partido contra ${match.equipoLocal}`
      );
      if (onUpdate) onUpdate();
    } catch (error) {
      await sweetAlert.error(
        "Error",
        error.message || "No se pudo unir al partido"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeave = async () => {
    const confirmResult = await sweetAlert.confirm(
      "¿Salir del partido?",
      `¿Salir del partido contra ${match.equipoLocal}?\n\nEsta acción no se puede deshacer.`,
      "Sí, salir",
      "Cancelar"
    );

    if (!confirmResult.isConfirmed) return;

    setIsLoading(true);
    try {
      await matchesService.leaveMatch(match.id);
      await sweetAlert.success("Has salido del partido");
      if (onUpdate) onUpdate();
    } catch (error) {
      await sweetAlert.error(
        "Error",
        error.message || "No se pudo salir del partido"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmResult = await sweetAlert.confirmCritical(
      "¿Eliminar partido?",
      `¿Eliminar el partido programado para ${match.fecha}?\n\nEsta acción no se puede deshacer.`,
      "Sí, eliminar",
      "Cancelar"
    );

    if (!confirmResult.isConfirmed) return;

    setIsLoading(true);
    try {
      await matchesService.deleteMatch(match.id);
      await sweetAlert.success("Partido eliminado");
      if (onUpdate) onUpdate();
    } catch (error) {
      await sweetAlert.error(
        "Error",
        error.message || "No se pudo eliminar el partido"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultSubmit = async (e) => {
    e.preventDefault();

    const confirmResult = await sweetAlert.confirm(
      "¿Cargar resultado?",
      `¿Cargar resultado ${resultData.goles_local} - ${resultData.goles_visitante}?`,
      "Sí, cargar",
      "Cancelar"
    );

    if (!confirmResult.isConfirmed) return;

    setIsLoading(true);
    try {
      await matchesService.updateResult(match.id, resultData);
      await sweetAlert.success(
        "Resultado cargado",
        "El otro equipo debe confirmar"
      );
      setShowResultForm(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      await sweetAlert.error(
        "Error",
        error.message || "No se pudo cargar el resultado"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmResult = async () => {
    const confirmResult = await sweetAlert.confirm(
      "¿Confirmar resultado?",
      `¿Confirmar resultado ${match.golesLocal} - ${match.golesVisitante}?`,
      "Sí, confirmar",
      "Cancelar"
    );

    if (!confirmResult.isConfirmed) return;

    setIsLoading(true);
    try {
      await matchesService.confirmResult(match.id);
      await sweetAlert.success("Resultado confirmado");
      if (onUpdate) onUpdate();
    } catch (error) {
      await sweetAlert.error("Error", error.message || "No se pudo confirmar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectResult = async () => {
    const confirmResult = await sweetAlert.confirm(
      "¿Rechazar resultado?",
      `¿Rechazar resultado ${match.golesLocal} - ${match.golesVisitante}?\n\nSe deberán cargar nuevos resultados.`,
      "Sí, rechazar",
      "Cancelar"
    );

    if (!confirmResult.isConfirmed) return;

    setIsLoading(true);
    try {
      await matchesService.rejectResult(match.id);
      await sweetAlert.success(
        "Resultado rechazado",
        "Reporte enviado"
      );
      if (onUpdate) onUpdate();
    } catch (error) {
      await sweetAlert.error("Error", error.message || "No se pudo rechazar");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    const statusMap = {
      SIN_CARGAR: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Pendiente",
      },
      CONFIRMACION_PENDIENTE: {
        color: "bg-blue-100 text-blue-800",
        label: "Confirmación pendiente",
      },
      CONFIRMADO: { color: "bg-green-100 text-green-800", label: "Confirmado" },
      INDEFINIDO: {
        color: "bg-red-100 text-red-800",
        label: "Resultado rechazado",
      },
    };

    const status = statusMap[match.estado] || {
      color: "bg-gray-100 text-gray-800",
      label: match.estado,
    };

    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}
      >
        {status.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Información del partido */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h4 className="font-bold text-gray-800 text-lg">
                {match.cancha}
              </h4>
              <p className="text-gray-600">
                {match.fecha} • {match.hora}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              {isCreator && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                  Creador
                </span>
              )}
              {isVisitorCaptain && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  Visitante
                </span>
              )}
            </div>
          </div>

          {/* Equipos y resultado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Equipo Local */}
            <div
              className={`p-4 rounded-lg ${
                isCreator ? "bg-green-50 border border-green-200" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    isCreator
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {match.equipoLocal?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {match.equipoLocal}
                  </p>
                  <p className="text-xs text-gray-500">Local</p>
                  {isCreator && <p className="text-xs text-green-600">(Tú)</p>}
                </div>
              </div>
              {match.golesLocal !== null && match.golesLocal !== undefined && (
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-800">
                    {match.golesLocal}
                  </span>
                </div>
              )}
            </div>

            {/* VS */}
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-300 mb-1">VS</div>
                {/* {console.log(match.equipoVisitante)} */}
                {match.estado === "SIN_CARGAR" && !match.equipoVisitante && (
                  <div className="text-xs text-yellow-600 font-medium px-3 py-1 bg-yellow-50 rounded-full">
                    Buscando rival
                  </div>
                )}
                {match.golesLocal !== null && match.golesVisitante !== null && (
                  <div className="text-sm font-bold text-gray-800">
                    {match.golesLocal} - {match.golesVisitante}
                  </div>
                )}
              </div>
            </div>

            {/* Equipo Visitante */}
            <div
              className={`p-4 rounded-lg ${
                isVisitorCaptain
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    isVisitorCaptain
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {match.equipoVisitante?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {match.equipoVisitante}
                  </p>
                  <p className="text-xs text-gray-500">Visitante</p>
                  {isVisitorCaptain && (
                    <p className="text-xs text-blue-600">(Tú)</p>
                  )}
                </div>
              </div>
              {match.golesVisitante !== null &&
                match.golesVisitante !== undefined && (
                  <div className="text-center">
                    <span className="text-2xl font-bold text-gray-800">
                      {match.golesVisitante}
                    </span>
                  </div>
                )}
              {!match.equipoVisitanteId && (
                <p className="text-xs text-gray-500 italic mt-2">
                  Esperando equipo...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de resultado (solo para creador) */}
      {showResultForm && isCreator && (
        <form
          onSubmit={handleResultSubmit}
          className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {match.equipoLocal}
              </label>
              <input
                type="number"
                min="0"
                value={resultData.goles_local}
                onChange={(e) =>
                  setResultData((prev) => ({
                    ...prev,
                    goles_local: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {match.equipoVisitante || "Rival"}
              </label>
              <input
                type="number"
                min="0"
                value={resultData.goles_visitante}
                onChange={(e) =>
                  setResultData((prev) => ({
                    ...prev,
                    goles_visitante: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Cargar Resultado
            </button>
            <button
              type="button"
              onClick={() => setShowResultForm(false)}
              className="px-4 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
        {/* Botón para unirse */}
        {canJoin && (
          <button
            onClick={handleJoin}
            disabled={isLoading}
            className="flex-1 min-w-[200px] bg-green-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                Uniendo...
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Unirse al Partido
              </>
            )}
          </button>
        )}

        {/* Botón para salir */}
        {canLeave && (
          <button
            onClick={handleLeave}
            disabled={isLoading}
            className="flex-1 min-w-[200px] bg-yellow-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-yellow-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                Saliendo...
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Salir del Partido
              </>
            )}
          </button>
        )}

        {/* Botón para cargar resultado */}
        {canUpdateResult && (
          <button
            onClick={() => setShowResultForm(!showResultForm)}
            disabled={isLoading}
            className="flex-1 min-w-[200px] bg-blue-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {showResultForm ? "Cancelar" : "Cargar Resultado"}
          </button>
        )}

        {/* Botones para confirmar/rechazar resultado */}
        {canConfirmResult && (
          <button
            onClick={handleConfirmResult}
            disabled={isLoading}
            className="flex-1 min-w-[200px] bg-green-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                Confirmando...
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Confirmar Resultado
              </>
            )}
          </button>
        )}

        {canRejectResult && (
          <button
            onClick={handleRejectResult}
            disabled={isLoading}
            className="flex-1 min-w-[200px] bg-red-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                Rechazando...
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Rechazar Resultado
              </>
            )}
          </button>
        )}

        {/* Botón para eliminar (solo creador si está pendiente) */}
        {isCreator && match.estado === "SIN_CARGAR" && (
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 min-w-[200px] bg-red-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                Eliminando...
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Eliminar Partido
              </>
            )}
          </button>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 gap-1">
          <span>
            Creado: {new Date(match.creadoEn).toLocaleDateString("es-ES")}
          </span>
          {match.actualizadoEn && match.actualizadoEn !== match.creadoEn && (
            <span>
              Actualizado:{" "}
              {new Date(match.actualizadoEn).toLocaleDateString("es-ES")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MatchCard;
