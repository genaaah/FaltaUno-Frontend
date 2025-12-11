import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import MatchList from "../components/Matches/MatchList";

function Game() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const isCaptain = user?.rol === "capitan";

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Partidos</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Encuentra partidos para unirte, gestiona los de tu equipo o crea
              nuevos encuentros.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "all"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Todos los Partidos
              </div>
            </button>
            <button
              onClick={() => setActiveTab("my")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "my"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Mis Partidos
              </div>
            </button>
            {isCaptain && (
              <button
                onClick={() => setActiveTab("create")}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === "create"
                    ? "bg-green-700 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
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
                </div>
              </button>
            )}
          </div>
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user?.equipo?.nombre?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {user?.equipo?.nombre || "Sin equipo"}
                    </h3>
                    <p className="text-gray-600">
                      {isCaptain
                        ? "Capitán - Puedes crear partidos"
                        : "Jugador - Puedes unirte a partidos"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {user?.equipo?.cantidad_jugadores || 1}/5
                  </div>
                  <div className="text-gray-600">Jugadores en equipo</div>
                  <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          ((user?.equipo?.cantidad_jugadores || 1) / 5) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            {activeTab === "all" && <MatchList isMyMatches={false} />}

            {activeTab === "my" && <MatchList isMyMatches={true} />}

            {activeTab === "create" && isCaptain && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <MatchList isMyMatches={false} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
