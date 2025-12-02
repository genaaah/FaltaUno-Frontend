import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMatches } from "../hooks/useMatches";
import CreateMatchModal from "../components/Game/CreateMatchModal";
import MatchGrid from "../components/Game/MatchGrid";
import Calendar from "../components/Calendar/Calendar";

function Game() {
  const { user } = useAuth();
  const { matches, createMatch, deleteMatch, joinMatch, leaveMatch } =
    useMatches();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

  const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");

  const handleCreateMatch = (newMatch) => {
    const exists = matches.some(
      (match) =>
        match.cancha === newMatch.cancha &&
        match.fecha === newMatch.fecha &&
        match.hora === newMatch.hora
    );

    if (exists) {
      alert("Ya hay un partido en esa cancha, fecha y hora.");
      return;
    }

    createMatch(newMatch);
  };

  const handleJoinMatch = (matchId) => {
    joinMatch(matchId, user.id);
  };

  const handleLeaveMatch = (matchId) => {
    leaveMatch(matchId);
  };

  const handleDeleteMatch = (matchId) => {
    if (window.confirm("¿Estás seguro de que querés eliminar este partido?")) {
      deleteMatch(matchId);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-auto bg-green-50">
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
        >
          CREAR PARTIDO
        </button>
        <button
          onClick={() => alert("Próximamente...")}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
        >
          COMPLETAR PARTIDO
        </button>
        <button
          onClick={() => setIsCalendarModalOpen(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
        >
          VER CALENDARIO
        </button>
      </div>

      <MatchGrid
        matches={matches}
        users={allUsers}
        onDelete={handleDeleteMatch}
        onJoin={handleJoinMatch}
        onLeave={handleLeaveMatch}
      />

      <CreateMatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateMatch}
      />

      {isCalendarModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl my-8 relative">
            <button
              onClick={() => setIsCalendarModalOpen(false)}
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 z-10"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
              Calendario de Partidos
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Calendar
                  onDateSelect={setSelectedCalendarDate}
                  selectedDate={selectedCalendarDate}
                  compact={false}
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-green-600">
                  {selectedCalendarDate
                    ? "Partidos en esta fecha"
                    : "Próximos partidos"}
                </h3>

                {selectedCalendarDate && (
                  <button
                    onClick={() => setSelectedCalendarDate(null)}
                    className="w-full mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Limpiar filtro
                  </button>
                )}

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {(selectedCalendarDate
                    ? matches.filter(
                        (match) => match.fecha === selectedCalendarDate
                      )
                    : matches
                  ).length > 0 ? (
                    (selectedCalendarDate
                      ? matches.filter(
                          (match) => match.fecha === selectedCalendarDate
                        )
                      : matches
                    ).map((match) => {
                      const localTeam = allUsers.find(
                        (u) => u.id === match.idEquipoLocal
                      );
                      const visitingTeam = allUsers.find(
                        (u) => u.id === match.idEquipoVisitante
                      );

                      return (
                        <div
                          key={match.id}
                          className="border-l-4 border-green-600 bg-gradient-to-r from-green-50 to-white p-4 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <p className="font-bold text-green-700 text-sm">
                            {match.cancha}
                          </p>
                          <p className="text-xs text-gray-600 mb-2">
                            {match.fecha} • {match.hora}:00 HS
                          </p>

                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={localTeam?.team_shield}
                              alt="Local"
                              className="w-6 h-6 object-contain"
                            />
                            <span className="text-xs font-semibold text-gray-800 flex-1">
                              {localTeam?.team_name}
                            </span>
                          </div>

                          {visitingTeam ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={visitingTeam?.team_shield}
                                alt="Visitante"
                                className="w-6 h-6 object-contain"
                              />
                              <span className="text-xs font-semibold text-gray-800 flex-1">
                                {visitingTeam?.team_name}
                              </span>
                            </div>
                          ) : (
                            <p className="text-xs text-green-600 font-semibold">
                              Esperando oponente...
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">
                        {selectedCalendarDate
                          ? "No hay partidos en esta fecha"
                          : "No hay partidos próximos"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
