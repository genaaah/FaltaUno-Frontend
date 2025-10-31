import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMatches } from "../hooks/useMatches";
import CreateMatchModal from "../components/Game/CreateMatchModal";
import MatchGrid from "../components/Game/MatchGrid";

function Game() {
  const { user } = useAuth();
  const { matches, createMatch, deleteMatch, joinMatch, leaveMatch } =
    useMatches();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          onClick={() => alert("Próximamente...")}
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
    </div>
  );
}

export default Game;
