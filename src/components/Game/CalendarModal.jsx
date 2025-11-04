import React from "react";

function CalendarModal({ isOpen, onClose, matches, users }) {
  const getTeamById = (teamId) => {
    return users.find((user) => user.id === teamId);
  };

  // Agrupar partidos por fecha
  const matchesByDate = matches.reduce((acc, match) => {
    if (!acc[match.fecha]) {
      acc[match.fecha] = [];
    }
    acc[match.fecha].push(match);
    return acc;
  }, {});

  // Ordenar fechas
  const sortedDates = Object.keys(matchesByDate).sort();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[80vh] overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
          CALENDARIO DE PARTIDOS
        </h2>

        {sortedDates.length === 0 ? (
          <p className="text-center text-gray-500">No hay partidos programados.</p>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((date) => (
              <div key={date} className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-green-600 mb-3">
                  {new Date(date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchesByDate[date].map((match) => {
                    const localTeam = getTeamById(match.idEquipoLocal);
                    const visitingTeam = match.idEquipoVisitante
                      ? getTeamById(match.idEquipoVisitante)
                      : null;

                    return (
                      <div key={match.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-green-600">
                            {match.cancha}
                          </span>
                          <span className="text-sm text-gray-600">
                            {match.hora}:00 HS
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={localTeam.team_shield}
                              alt={localTeam.team_name}
                              className="w-8 h-8 object-contain"
                            />
                            <span className="text-sm font-medium">
                              {localTeam.team_name}
                            </span>
                          </div>
                          <span className="text-green-600 font-bold">vs</span>
                          {visitingTeam ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={visitingTeam.team_shield}
                                alt={visitingTeam.team_name}
                                className="w-8 h-8 object-contain"
                              />
                              <span className="text-sm font-medium">
                                {visitingTeam.team_name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">Esperando rival</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarModal;
