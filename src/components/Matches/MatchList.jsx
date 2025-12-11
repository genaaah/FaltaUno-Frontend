import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { matchesService } from "../../services/matchesService";
import MatchCard from "./MatchCard";
import CreateMatchForm from "./CreateMatchForm";

function MatchList({ isMyMatches = false }) {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchMatches();
  }, [isMyMatches]);

  const fetchMatches = async () => {
    console.log("🧳 Cargando partidos...");
    setLoading(true);
    setError("");
    try {
      const data = isMyMatches
        ? await matchesService.getMyMatches()
        : await matchesService.getAllMatches();

      const transformedMatches = Array.isArray(data)
        ? data.map((match) => matchesService.transformMatchData(match))
        : [];

      console.log("📋 Partidos transformados:", transformedMatches);
      setMatches(transformedMatches);
    } catch (error) {
      console.error("Error al cargar partidos:", error);
      setError("No se pudieron cargar los partidos");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchCreated = (newMatch) => {
    fetchMatches();
    setShowCreateForm(false);
  };

  const handleMatchUpdated = () => {
    fetchMatches();
  };

  const filteredMatches = matches.filter((match) => {
    if (isMyMatches) {
      const isUserMatch =
        match.equipoLocalId === user?.equipoId ||
        match.equipoVisitanteId === user?.equipoId;

      if (!isUserMatch) return false;

      if (filter === "all") return true;
      if (filter === "open")
        return !match.equipoVisitanteId && match.estado === "sin_cargar";
      if (filter === "pending")
        return match.estado === "sin_cargar" && match.equipoVisitanteId;
      if (filter === "confirmation")
        return match.estado === "confirmacion_pendiente";
      if (filter === "confirmed") return match.estado === "confirmado";
      if (filter === "rejected") return match.estado === "indefinido";
      return true;
    } else {
      if (match.estado === "confirmado") {
        return false;
      }
      if (filter === "all") return true;
      if (filter === "open")
        return !match.equipoVisitanteId && match.estado === "sin_cargar";
      if (filter === "pending")
        return match.estado === "sin_cargar" && match.equipoVisitanteId;
      if (filter === "confirmation")
        return match.estado === "confirmacion_pendiente";
      if (filter === "my") {
        return (
          match.equipoLocalId === user?.equipoId ||
          match.equipoVisitanteId === user?.equipoId
        );
      }
      return true;
    }
  });

  const getStats = () => {
    if (isMyMatches) {
      const myMatches = matches.filter(
        (match) =>
          match.equipoLocalId === user?.equipoId ||
          match.equipoVisitanteId === user?.equipoId
      );

      return {
        total: myMatches.length,
        open: myMatches.filter(
          (m) => !m.equipoVisitanteId && m.estado === "sin_cargar"
        ).length,
        pending: myMatches.filter(
          (m) => m.estado === "sin_cargar" && m.equipoVisitanteId
        ).length,
        confirmation: myMatches.filter(
          (m) => m.estado === "confirmacion_pendiente"
        ).length,
        confirmed: myMatches.filter((m) => m.estado === "confirmado").length,
        rejected: myMatches.filter((m) => m.estado === "indefinido").length,
      };
    } else {
      const availableMatches = matches.filter(
        (match) => match.estado !== "confirmado"
      );

      return {
        total: availableMatches.length,
        open: availableMatches.filter(
          (m) => !m.equipoVisitanteId && m.estado === "sin_cargar"
        ).length,
        pending: availableMatches.filter(
          (m) => m.estado === "sin_cargar" && m.equipoVisitanteId
        ).length,
        confirmation: availableMatches.filter(
          (m) => m.estado === "confirmacion_pendiente"
        ).length,
        confirmed: 0,
        rejected: 0,
      };
    }
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Cargando partidos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {isMyMatches ? "Mis Partidos" : "Partidos Disponibles"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isMyMatches
                ? "Gestiona los partidos de tu equipo"
                : "Encuentra partidos para unirte o crear nuevos"}
            </p>
          </div>

          {!isMyMatches && user?.rol === "capitan" && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Crear Partido
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-2xl font-bold text-gray-800">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {stats.open}
            </div>
            <div className="text-sm text-gray-600">Abiertos</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {stats.confirmation}
            </div>
            <div className="text-sm text-gray-600">Por confirmar</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {stats.confirmed}
            </div>
            <div className="text-sm text-gray-600">Confirmados</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter("open")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "open"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Abiertos ({stats.open})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "pending"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pendientes ({stats.pending})
          </button>
          <button
            onClick={() => setFilter("confirmation")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "confirmation"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Por confirmar ({stats.confirmation})
          </button>

          {/* Mostrar filtros adicionales solo en "Mis Partidos" */}
          {isMyMatches && (
            <>
              <button
                onClick={() => setFilter("confirmed")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "confirmed"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Confirmados ({stats.confirmed})
              </button>
              <button
                onClick={() => setFilter("rejected")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "rejected"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Rechazados ({stats.rejected || 0})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <CreateMatchForm
              onSuccess={handleMatchCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {isMyMatches
              ? "No tienes partidos programados"
              : "No hay partidos disponibles"}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {isMyMatches
              ? "Crea tu primer partido o únete a uno existente"
              : "Sé el primero en crear un partido"}
          </p>
          {!isMyMatches && user?.rol === "capitan" && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Crear Primer Partido
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-600">
              Mostrando{" "}
              <span className="font-bold text-green-600">
                {filteredMatches.length}
              </span>{" "}
              partido{filteredMatches.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={fetchMatches}
              className="text-green-600 hover:text-green-800 font-semibold flex items-center gap-2"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Actualizar
            </button>
          </div>

          <div className="space-y-4">
            {filteredMatches.map((match) => {
              return (
                <MatchCard
                  key={match.id}
                  match={match}
                  onUpdate={handleMatchUpdated}
                  isMyMatch={isMyMatches}
                />
              );
            })}
          </div>

          {/* Información */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-500 mt-0.5"
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
              <div>
                <h4 className="font-semibold text-blue-800">
                  Información sobre los partidos
                </h4>
                <ul className="text-blue-600 text-sm mt-2 space-y-1">
                  <li>
                    • Solo los capitanes (rol "capitan") pueden crear partidos
                  </li>
                  <li>
                    • Un partido "abierto" es aquel que no tiene rival definido
                  </li>
                  <li>• Cualquier capitán puede unirse a un partido abierto</li>
                  <li>
                    • El creador carga el resultado, el visitante lo confirma
                  </li>
                  <li>• Los resultados confirmados no se pueden modificar</li>
                  <li>• Se pueden eliminar partidos hasta 24 horas antes</li>
                  {!isMyMatches && (
                    <li>
                      • Los partidos confirmados solo se muestran en "Mis
                      Partidos"
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MatchList;
