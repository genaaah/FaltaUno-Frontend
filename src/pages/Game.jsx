import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import MatchList from "../components/Matches/MatchList";

function Game() {
  const { user } = useAuth();
  const [activeTab] = useState("all");
  const isCaptain = user?.rol === "capitan";

  const teamInitial = user?.equipo?.nombre?.charAt(0)?.toUpperCase() || "?";
  const teamName = user?.equipo?.nombre || "Sin equipo";
  const teamSize = user?.equipo?.cantidad_jugadores || 1;
  const teamPercentage = Math.min((teamSize / 5) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container px-4 py-6 mx-auto md:py-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 text-center md:mb-12">
            <h1 className="mb-3 text-4xl font-bold text-gray-800 md:text-5xl">
              Partidos
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 md:text-xl">
              Encuentra partidos para unirte, gestiona los de tu equipo o crea
              nuevos encuentros.
            </p>
          </header>
          <section className="mb-8">
            <div className="p-4 bg-white rounded-xl shadow-lg md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white bg-green-600 rounded-full md:w-20 md:h-20 md:text-3xl">
                    {teamInitial}
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold text-gray-800 md:text-2xl">
                      {teamName}
                    </h3>
                    <p className="text-gray-600">
                      {isCaptain
                        ? "Capitán - Puedes crear partidos"
                        : "Jugador - Puedes unirte a partidos"}
                    </p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-2xl font-bold text-gray-800 md:text-3xl">
                    {teamSize}/5
                  </div>
                  <p className="text-gray-600">Jugadores en equipo</p>
                  <div className="w-full max-w-xs mx-auto mt-2 bg-gray-200 rounded-full h-2 md:w-48 md:mx-0">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${teamPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="mt-8">
            <div className="p-4 bg-white rounded-xl shadow-lg md:p-6 lg:p-8">
              <MatchList isMyMatches={false} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Game;
