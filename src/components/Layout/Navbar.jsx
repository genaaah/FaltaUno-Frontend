import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo-falta1.png";
import CreateTeamModal from "./CreateTeamModal";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const isActive = (path) => {
    return location.pathname === path ? "bg-green-900 text-green-300" : "";
  };

  const hasTeam = user?.team_name && user.team_name !== "Sin equipo";

  return (
    <>
      <nav className="w-64 bg-green-950 text-green-100 p-6 flex flex-col justify-between rounded-r-2xl h-screen sticky top-0">
        <div>
          <div className="flex flex-col items-center gap-3 mb-6">
            <img
              src={logo}
              alt="Logo Falta1"
              className="w-14 h-14 object-contain"
            />
            <p className="text-green-200 text-sm text-center">
              Equipo{" "}
              <span className="font-bold text-white block">
                {user?.team_name}
              </span>
            </p>
            {user?.team_shield &&
              user.team_shield !==
                "https://via.placeholder.com/150/007e33/ffffff?text=SIN+EQUIPO" && (
                <img
                  src={user.team_shield}
                  alt="Escudo del equipo"
                  className="w-12 h-12 object-contain mt-2"
                />
              )}
          </div>

          <hr className="border-green-800 mb-6" />
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate("/")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-green-900 hover:text-green-300 ${isActive(
                  "/"
                )}`}
              >
                Inicio
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/game")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-green-900 hover:text-green-300 ${isActive(
                  "/game"
                )}`}
              >
                Jugar
              </button>
            </li>
            <li>
              <button
                onClick={() => alert("Próximamente...")}
                className="w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-green-900 hover:text-green-300"
              >
                Torneos
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/game?calendar=true")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-green-900 hover:text-green-300 ${isActive(
                  "/game"
                )}`}
              >
                Calendario
              </button>
            </li>
          </ul>

          <hr className="border-green-800 my-6" />
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => alert("Próximamente...")}
                className="w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-green-900 hover:text-green-300"
              >
                Tienda
              </button>
            </li>
            <li>
              <button
                onClick={() => alert("Próximamente...")}
                className="w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-green-900 hover:text-green-300"
              >
                Beneficios
              </button>
            </li>
          </ul>
        </div>
        <div>
          <hr className="border-green-800 mb-4" />
          <div className="space-y-3 mb-4">
            <div className="bg-green-900/50 rounded-lg p-1">
              <button
                onClick={() => setIsTeamModalOpen(true)}
                className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-2.5 px-4 rounded-md font-semibold hover:from-green-600 hover:to-green-500 transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-green-900/30"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {hasTeam ? "Cambiar Equipo" : "Crear Equipo"}
              </button>
            </div>

            <div className="bg-green-900/30 rounded-lg p-1">
              <button
                onClick={() =>
                  alert("Funcionalidad de unirse a equipo en desarrollo...")
                }
                className="w-full bg-gradient-to-r from-green-800 to-green-700 text-white py-2.5 px-4 rounded-md font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 text-sm flex items-center justify-center gap-2 border border-green-600/30 hover:border-green-500/50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Unirse a Equipo
              </button>
            </div>
          </div>

          <hr className="border-green-800 mb-4" />

          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-lg hover:shadow-red-900/30"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>
      <CreateTeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        currentTeamName={user?.team_name}
        currentTeamShield={user?.team_shield}
      />
    </>
  );
}

export default Navbar;
