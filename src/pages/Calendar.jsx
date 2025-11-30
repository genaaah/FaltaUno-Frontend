import React, { useState } from "react";
import { useMatches } from "../hooks/useMatches";
import Calendar from "../components/Calendar/Calendar";

function CalendarPage() {
  const { matches } = useMatches();
  const [selectedDate, setSelectedDate] = useState(null);

  const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");

  const getTeamName = (teamId) => {
    const userData = allUsers.find((u) => u.id === teamId);
    return userData?.team_name || "Desconocido";
  };

  const getTeamShield = (teamId) => {
    const userData = allUsers.find((u) => u.id === teamId);
    return userData?.team_shield || "";
  };

  // Get matches for selected date or all matches
  const displayMatches = selectedDate
    ? matches.filter((match) => match.fecha === selectedDate)
    : matches;

  return (
    <div className="flex-1 p-8 overflow-auto bg-green-50">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-900 mb-2">Calendario de Partidos</h1>
          <p className="text-gray-600">
            Visualiza todos los partidos disponibles en el calendario
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Calendar
              onDateSelect={setSelectedDate}
              selectedDate={selectedDate}
              compact={false}
            />
          </div>

          {/* Matches Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-green-600 mb-4">
                {selectedDate ? "Partidos seleccionados" : "Próximos partidos"}
              </h2>

              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="w-full mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                >
                  Limpiar filtro
                </button>
              )}

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {displayMatches.length > 0 ? (
                  displayMatches.map((match) => (
                    <div
                      key={match.id}
                      className="border-l-4 border-green-600 bg-gradient-to-r from-green-50 to-white p-4 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <p className="font-bold text-green-700 text-sm">{match.cancha}</p>
                      <p className="text-xs text-gray-600 mb-2">
                        {match.fecha} • {match.hora}:00 HS
                      </p>

                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={getTeamShield(match.idEquipoLocal)}
                          alt="Local"
                          className="w-6 h-6 object-contain"
                        />
                        <span className="text-xs font-semibold text-gray-800 flex-1">
                          {getTeamName(match.idEquipoLocal)}
                        </span>
                      </div>

                      {match.idEquipoVisitante ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={getTeamShield(match.idEquipoVisitante)}
                            alt="Visitante"
                            className="w-6 h-6 object-contain"
                          />
                          <span className="text-xs font-semibold text-gray-800 flex-1">
                            {getTeamName(match.idEquipoVisitante)}
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-green-600 font-semibold">Esperando oponente...</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                      {selectedDate ? "No hay partidos en esta fecha" : "No hay partidos próximos"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 shadow-lg text-white">
              <h3 className="font-bold text-lg mb-3">Estadísticas</h3>
              <div className="space-y-2 text-sm">
                <p>
                  Total de partidos:{" "}
                  <span className="font-bold text-green-100">{matches.length}</span>
                </p>
                <p>
                  Partidos confirmados:{" "}
                  <span className="font-bold text-green-100">
                    {matches.filter((m) => m.idEquipoVisitante).length}
                  </span>
                </p>
                <p>
                  Esperando oponente:{" "}
                  <span className="font-bold text-green-100">
                    {matches.filter((m) => !m.idEquipoVisitante).length}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
