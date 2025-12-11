import React from "react";
import { useAuth } from "../context/AuthContext";

function Calendar() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Calendario</h1>
            <p className="text-gray-600 mt-2">Próximamente: Vista de calendario de partidos</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
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
              Calendario en desarrollo
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Esta funcionalidad está en desarrollo. Pronto podrás ver todos tus partidos en formato de calendario.
            </p>
            <div className="mt-6">
              <a
                href="/game"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Ver Partidos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;