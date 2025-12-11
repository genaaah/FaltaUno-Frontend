import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { matchesService } from "../../services/matchesService";
import MatchCard from "./MatchCard";
import CreateMatchForm from "./CreateMatchForm";

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    <p className="mt-4 text-gray-600">Cargando partidos...</p>
  </div>
);

const ErrorMessage = ({ error }) => (
  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
    {error}
  </div>
);

const EmptyState = ({ isMyMatches, user, onCreateClick }) => (
  <div className="text-center py-12 md:py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      {isMyMatches ? "No tienes partidos programados" : "No hay partidos disponibles"}
    </h3>
    <p className="text-gray-500 max-w-md mx-auto mb-6">
      {isMyMatches ? "Crea tu primer partido o únete a uno existente" : "Sé el primero en crear un partido"}
    </p>
    {!isMyMatches && user?.rol === "capitan" && (
      <button 
        onClick={onCreateClick} 
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Crear Primer Partido
      </button>
    )}
  </div>
);

const FilterButton = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap
      ${active 
        ? "bg-green-600 text-white hover:bg-green-700" 
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }
    `}
  >
    {children}
    {count !== undefined && count > 0 && (
      <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-white bg-opacity-30 rounded-full">
        {count}
      </span>
    )}
  </button>
);

const StatsCard = ({ value, label, color = "text-gray-800" }) => (
  <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-sm text-gray-600 mt-1">{label}</div>
  </div>
);

const InfoPanel = ({ isMyMatches }) => (
  <div className="mt-6 md:mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-5">
    <div className="flex items-start gap-3">
      <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <h4 className="font-semibold text-blue-800 text-sm md:text-base">Información sobre los partidos</h4>
        <ul className="text-blue-600 text-xs md:text-sm mt-2 space-y-1">
          <li>• Solo los capitanes (rol "capitan") pueden crear partidos</li>
          <li>• Un partido "abierto" es aquel que no tiene rival definido</li>
          <li>• Cualquier capitán puede unirse a un partido abierto</li>
          <li>• El creador carga el resultado, el visitante lo confirma</li>
          <li>• Los resultados confirmados no se pueden modificar</li>
          {!isMyMatches && <li>• Los partidos confirmados solo se muestran en "Mis Partidos"</li>}
        </ul>
      </div>
    </div>
  </div>
);

const normalizeEstado = (raw) => {
  if (!raw && raw !== "") return "";
  return String(raw).toLowerCase();
};

const useMatchFilters = () => {
  const [filter, setFilter] = useState("all");
  
  const filters = useMemo(() => [
    { key: "all", label: "Todos" },
    { key: "open", label: "Abiertos" },
    { key: "pending", label: "Pendientes" },
    { key: "confirmation", label: "Por confirmar" },
    { key: "confirmed", label: "Confirmados" },
    { key: "rejected", label: "Rechazados" },
  ], []);

  return { filter, setFilter, filters };
};

const useMatchStats = (matches, user, isMyMatches) => {
  return useMemo(() => {
    const userEquipoId = user?.equipoId;
    const base = isMyMatches
      ? matches.filter((m) => m.equipoLocalId === userEquipoId || m.equipoVisitanteId === userEquipoId)
      : matches.filter((m) => normalizeEstado(m.estado) !== "confirmado");

    return base.reduce(
      (acc, m) => {
        const estado = normalizeEstado(m.estado);
        acc.total += 1;
        if (!m.equipoVisitanteId && estado === "sin_cargar") acc.open += 1;
        if (estado === "sin_cargar" && m.equipoVisitanteId) acc.pending += 1;
        if (estado === "confirmacion_pendiente") acc.confirmation += 1;
        if (estado === "confirmado") acc.confirmed += 1;
        if (estado === "indefinido") acc.rejected += 1;
        return acc;
      },
      { total: 0, open: 0, pending: 0, confirmation: 0, confirmed: 0, rejected: 0 }
    );
  }, [matches, user, isMyMatches]);
};

const useFilteredMatches = (matches, user, isMyMatches, filter) => {
  return useMemo(() => {
    const userEquipoId = user?.equipoId;

    return matches.filter((match) => {
      const estado = normalizeEstado(match.estado);

      if (!isMyMatches && estado === "confirmado") return false;

      if (isMyMatches) {
        const isUserMatch = match.equipoLocalId === userEquipoId || match.equipoVisitanteId === userEquipoId;
        if (!isUserMatch) return false;
      }

      switch (filter) {
        case "all":
          return true;
        case "open":
          return !match.equipoVisitanteId && estado === "sin_cargar";
        case "pending":
          return estado === "sin_cargar" && Boolean(match.equipoVisitanteId);
        case "confirmation":
          return estado === "confirmacion_pendiente";
        case "confirmed":
          return estado === "confirmado";
        case "rejected":
          return estado === "indefinido";
        case "my":
          return match.equipoLocalId === userEquipoId || match.equipoVisitanteId === userEquipoId;
        default:
          return true;
      }
    });
  }, [matches, user, isMyMatches, filter]);
};

function MatchList({ isMyMatches = false }) {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const { filter, setFilter, filters } = useMatchFilters();
  const stats = useMatchStats(matches, user, isMyMatches);
  const filteredMatches = useFilteredMatches(matches, user, isMyMatches, filter);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = isMyMatches 
        ? await matchesService.getMyMatches() 
        : await matchesService.getAllMatches();
      
      const transformed = Array.isArray(data) 
        ? data.map((m) => matchesService.transformMatchData(m)) 
        : [];
      
      setMatches(transformed);
    } catch (err) {
      console.error("Error cargando partidos:", err);
      setError("No se pudieron cargar los partidos. Intenta de nuevo más tarde.");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [isMyMatches]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleMatchCreated = () => {
    fetchMatches();
    setShowCreateForm(false);
  };

  const handleMatchUpdated = () => {
    fetchMatches();
  };

  const availableFilters = useMemo(() => {
    const baseFilters = [
      { key: "all", label: "Todos", count: stats.total },
      { key: "open", label: "Abiertos", count: stats.open },
      { key: "pending", label: "Pendientes", count: stats.pending },
      { key: "confirmation", label: "Por confirmar", count: stats.confirmation },
    ];

    if (isMyMatches) {
      return [
        ...baseFilters,
        { key: "confirmed", label: "Confirmados", count: stats.confirmed },
        { key: "rejected", label: "Rechazados", count: stats.rejected },
      ];
    }

    return baseFilters;
  }, [stats, isMyMatches]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {isMyMatches ? "Mis Partidos" : "Partidos Disponibles"}
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
              {isMyMatches 
                ? "Gestiona los partidos de tu equipo" 
                : "Encuentra partidos para unirte o crear nuevos"}
            </p>
          </div>

          {!isMyMatches && user?.rol === "capitan" && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Crear Partido</span>
              <span className="sm:hidden">Crear</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 mb-4 md:mb-6">
          <StatsCard value={stats.total} label="Total" color="text-gray-800" />
          <StatsCard value={stats.open} label="Abiertos" color="text-green-600" />
          <StatsCard value={stats.pending} label="Pendientes" color="text-yellow-600" />
          <StatsCard value={stats.confirmation} label="Por confirmar" color="text-blue-600" />
          {isMyMatches ? (
            <StatsCard value={stats.confirmed} label="Confirmados" color="text-purple-600" />
          ) : (
            <StatsCard value={stats.confirmed} label="Confirmados" color="text-purple-600" />
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
          {availableFilters.map(({ key, label, count }) => (
            <FilterButton
              key={key}
              active={filter === key}
              onClick={() => setFilter(key)}
              count={count}
            >
              {label}
            </FilterButton>
          ))}
        </div>
      </header>

      {error && <ErrorMessage error={error} />}

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CreateMatchForm 
              onSuccess={handleMatchCreated} 
              onCancel={() => setShowCreateForm(false)} 
            />
          </div>
        </div>
      )}

      {filteredMatches.length === 0 ? (
        <EmptyState 
          isMyMatches={isMyMatches} 
          user={user} 
          onCreateClick={() => setShowCreateForm(true)}
        />
      ) : (
        <>
          <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-gray-600 text-sm md:text-base">
              Mostrando <span className="font-bold text-green-600">{filteredMatches.length}</span> partido{filteredMatches.length !== 1 ? "s" : ""}
            </p>
            <button 
              onClick={fetchMatches}
              className="text-green-600 hover:text-green-800 font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          </div>

          <div className="space-y-3 md:space-y-4">
            {filteredMatches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                onUpdate={handleMatchUpdated} 
                isMyMatch={isMyMatches} 
              />
            ))}
          </div>

          <InfoPanel isMyMatches={isMyMatches} />
        </>
      )}
    </div>
  );
}

export default MatchList;