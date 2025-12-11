import React from "react";
import { useAuth } from "../../context/AuthContext";

function MatchCard({
  match,
  localTeam,
  visitingTeam,
  onDelete,
  onJoin,
  onLeave,
}) {
  const { user } = useAuth();

  const isLocalTeam = match.idEquipoLocal === user.id;
  const isVisitingTeam = match.idEquipoVisitante === user.id;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform">
      <h3 className="text-green-600 font-bold text-lg mb-4 text-center">
        {match.cancha}
      </h3>

      <div className="flex justify-between items-center gap-4 mb-4">
        <div className="flex flex-col items-center flex-1">
          <img
            src={localTeam.team_shield}
            alt={localTeam.team_name}
            className="w-12 h-12 object-contain mb-2"
          />
          <span className="text-sm font-semibold text-gray-800 text-center">
            {localTeam.team_name}
          </span>
        </div>
        <span className="font-bold text-green-600 text-lg">vs</span>
        {visitingTeam ? (
          <div className="flex flex-col items-center flex-1">
            <img
              src={visitingTeam.team_shield}
              alt={visitingTeam.team_name}
              className="w-12 h-12 object-contain mb-2"
            />
            <span className="text-sm font-semibold text-gray-800 text-center">
              {visitingTeam.team_name}
            </span>
          </div>
        ) : (
          <div className="flex-1">
            {isLocalTeam ? (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-600 py-3 px-4 rounded-xl font-semibold cursor-not-allowed border-2 border-dashed border-gray-400"
              >
                ESPERANDO...
              </button>
            ) : (
              <button
                onClick={() => onJoin(match.id)}
                className="w-full bg-green-100 border-2 border-dashed border-green-400 text-green-700 py-3 px-4 rounded-xl font-semibold hover:bg-green-200 transition-colors"
              >
                JUGAR +
              </button>
            )}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 text-center">
        {match.fecha} / {match.hora}:00 HS
      </p>
      <div className="mt-4 flex gap-2">
        {isLocalTeam && (
          <button
            onClick={() => onDelete(match.id)}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        )}
        {isVisitingTeam && (
          <button
            onClick={() => onLeave(match.id)}
            className="flex-1 bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
          >
            Retirarse
          </button>
        )}
      </div>
    </div>
  );
}

export default MatchCard;
