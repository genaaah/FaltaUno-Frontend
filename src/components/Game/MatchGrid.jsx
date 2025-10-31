import React from "react";
import MatchCard from "./MatchCard";

function MatchGrid({ matches, users, onDelete, onJoin, onLeave }) {
  const getTeamById = (teamId) => {
    return users.find((user) => user.id === teamId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => {
        const localTeam = getTeamById(match.idEquipoLocal);
        const visitingTeam = match.idEquipoVisitante
          ? getTeamById(match.idEquipoVisitante)
          : null;

        return (
          <MatchCard
            key={match.id}
            match={match}
            localTeam={localTeam}
            visitingTeam={visitingTeam}
            onDelete={onDelete}
            onJoin={onJoin}
            onLeave={onLeave}
          />
        );
      })}
    </div>
  );
}

export default MatchGrid;
