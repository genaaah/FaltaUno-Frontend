import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { invitationService } from "../../services/invitationService";
import { userSearchService } from "../../services/userSearchService";
import { teamService } from "../../services/teamService";
import logo from "../../assets/logo-falta1.png";
import CreateTeamModal from "./CreateTeamModal";
import SendInvitationModal from "../Invitations/SendInvitationModal";

function Navbar() {
  const { user, logout, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);
  const [invitationCount, setInvitationCount] = useState(0);
  const [hasPendingInvitations, setHasPendingInvitations] = useState(false);
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!hasTeam) {
          const invitations = await invitationService.getInvitations();
          setInvitationCount(invitations.length || 0);
          setHasPendingInvitations(invitations.length > 0);
        } else {
          setInvitationCount(0);
          setHasPendingInvitations(false);

          try {
            const teamInfo = await teamService.getTeamById(user.equipoId);
            setTeamData(teamInfo);

            if (
              teamInfo.cantidad_jugadores !== user.equipo?.cantidad_jugadores
            ) {
              console.log("Datos de equipo desactualizados, refrescando...");
              refreshUser();
            }
          } catch (teamError) {
            console.warn("No se pudo obtener datos del equipo:", teamError);
          }
        }
      } catch (error) {
        setInvitationCount(0);
        setHasPendingInvitations(false);
      }
    };

    if (user) {
      fetchData();

      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const isActive = (path) => {
    return location.pathname === path ? "bg-green-900 text-green-300" : "";
  };

  const hasTeam = user?.equipo !== null;

  const fullName = user ? `${user.nombre} ${user.apellido}` : "";

  const getUserRole = () => {
    if (!user?.rol) return "";

    const roles = {
      admin: "Administrador",
      capitan: "Capitán",
      jugador: "Jugador",
      usuario: "Usuario",
    };

    return roles[user.rol] || user.rol;
  };

  const isCaptain = user?.rol === "capitan";

  const VisibilityToggleCompact = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const canChangeVisibility =
      user?.rol === "usuario" && !hasPendingInvitations;

    const handleToggleVisibility = async () => {
      console.log("Intentando cambiar visibilidad...", {
        userId: user?.id,
        currentVisible: user?.visible,
        canChange: canChangeVisibility,
        hasPendingInvitations,
      });

      if (hasPendingInvitations) {
        setMessage(
          "⚠️ Tienes invitaciones pendientes. Recházalas primero para ocultar tu perfil."
        );
        setTimeout(() => setMessage(""), 4000);
        return;
      }

      if (!canChangeVisibility) {
        setMessage("⚠️ Solo usuarios sin equipo pueden cambiar su visibilidad");
        setTimeout(() => setMessage(""), 3000);
        return;
      }

      const newVisibility = !user.visible;
      const actionText = newVisibility ? "mostrar" : "ocultar";

      if (
        !window.confirm(
          `¿${user.visible ? "Ocultar" : "Mostrar"} tu perfil?\n\n` +
            `${
              newVisibility
                ? "✅ Tu perfil será visible para otros capitanes y podrán invitarte a sus equipos."
                : "❌ Tu perfil será oculto y no recibirás invitaciones."
            }`
        )
      ) {
        return;
      }

      setIsLoading(true);
      setMessage("Procesando...");

      try {
        const result = await userSearchService.changeVisibility();

        const successMessage =
          result.message ||
          result.mesagge ||
          "✅ Visibilidad actualizada correctamente";
        setMessage(successMessage);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error("Error al cambiar visibilidad:", error);
        setMessage(`❌ Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.rol !== "usuario") {
      return null;
    }

    return (
      <div className="relative">
        {hasPendingInvitations && (
          <div className="mb-2 p-2 bg-yellow-900/30 rounded-lg text-xs text-yellow-300 text-center">
            ⚠️ Tienes {invitationCount} invitación
            {invitationCount !== 1 ? "es" : ""} pendiente
            {invitationCount !== 1 ? "s" : ""}
          </div>
        )}

        <button
          onClick={handleToggleVisibility}
          disabled={isLoading || hasPendingInvitations}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center ${
            user.visible
              ? hasPendingInvitations
                ? "bg-yellow-100 text-yellow-800 border border-yellow-300 cursor-not-allowed"
                : "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300"
              : hasPendingInvitations
              ? "bg-gray-100 text-gray-500 border border-gray-300 cursor-not-allowed"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
          } ${
            isLoading || hasPendingInvitations
              ? "opacity-70 cursor-not-allowed"
              : ""
          }`}
          title={
            hasPendingInvitations
              ? `Tienes ${invitationCount} invitación${
                  invitationCount !== 1 ? "es" : ""
                } pendiente${
                  invitationCount !== 1 ? "s" : ""
                }. Recházalas primero.`
              : user.visible
              ? "Perfil visible - Click para ocultar"
              : "Perfil oculto - Click para mostrar"
          }
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Procesando...</span>
            </>
          ) : user.visible ? (
            <>
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>Visible</span>
            </>
          ) : (
            <>
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
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
              <span>Oculto</span>
            </>
          )}
        </button>

        {message && (
          <div
            className={`absolute top-full left-0 mt-2 w-full text-xs rounded-lg p-2 z-50 shadow-lg ${
              message.includes("✅") || message.includes("correctamente")
                ? "bg-green-100 text-green-800 border border-green-300"
                : message.includes("❌") || message.includes("Error")
                ? "bg-red-100 text-red-800 border border-red-300"
                : "bg-yellow-100 text-yellow-800 border border-yellow-300"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <nav className="w-64 bg-green-950 text-green-100 p-6 flex flex-col justify-between rounded-r-2xl h-auto lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto">
        <div>
          <div className="flex flex-col items-center gap-3 mb-6">
            <img
              src={logo}
              alt="Logo Falta1"
              className="w-14 h-14 object-contain"
            />

            <div className="text-center">
              <p className="font-bold text-white text-lg">{fullName}</p>
              <p className="text-green-300 text-sm">{getUserRole()}</p>
            </div>

            <div className="mt-2 text-center">
              <p className="text-green-200 text-sm">
                {hasTeam ? "Equipo" : "Sin equipo"}
              </p>
              <span className="font-bold text-white block">
                {hasTeam ? user.equipo.nombre : "Sin equipo"}
              </span>
              {hasTeam && (
                <p className="text-green-300 text-xs mt-1">
                  ID: {user.equipo.id}
                </p>
              )}
            </div>

            {hasTeam ? (
              <div className="mt-2">
                <div className="w-12 h-12 bg-green-800 rounded-full flex items-center justify-center text-white font-bold">
                  {user.equipo.nombre.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-bold">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
              </div>
            )}

            {user?.rol === "usuario" && (
              <div className="mt-3 w-full">
                <VisibilityToggleCompact />
              </div>
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
                onClick={() => navigate("/invitaciones")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-green-900 hover:text-green-300 ${isActive(
                  "/invitaciones"
                )} relative`}
              >
                Invitaciones
                {!hasTeam && invitationCount > 0 && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {invitationCount}
                  </span>
                )}
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
                onClick={() => navigate("/calendarios")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-green-900 hover:text-green-300 ${isActive(
                  "/calendarios"
                )}`}
              >
                Calendario
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/perfil")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-green-900 hover:text-green-300 ${isActive(
                  "/perfil"
                )}`}
              >
                Mi Perfil
              </button>
            </li>
          </ul>

          <hr className="border-green-800 my-6" />
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate("/store")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-green-900 hover:text-green-300 ${isActive(
                  "/store"
                )}`}
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
                {hasTeam ? "Gestionar Equipo" : "Crear Equipo"}
              </button>
            </div>

            <div className="bg-green-900/30 rounded-lg p-1">
              <button
                onClick={() => {
                  if (!hasTeam) {
                    alert(
                      "¡Primero necesitas tener un equipo para invitar jugadores!"
                    );
                  } else if (!isCaptain) {
                    alert("Solo el capitán puede invitar jugadores");
                  } else {
                    setIsInvitationModalOpen(true);
                  }
                }}
                className={`w-full bg-gradient-to-r from-green-800 to-green-700 text-white py-2.5 px-4 rounded-md font-semibold transition-all duration-200 text-sm flex items-center justify-center gap-2 border ${
                  hasTeam && isCaptain
                    ? "hover:from-green-700 hover:to-green-600 hover:border-green-500/50 border-green-600/30"
                    : "opacity-50 cursor-not-allowed border-green-600/20"
                }`}
                disabled={!hasTeam || !isCaptain}
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
                {hasTeam && isCaptain
                  ? "Invitar Jugadores"
                  : isCaptain
                  ? "Necesitas equipo"
                  : "Solo capitán"}
              </button>
            </div>

            {!hasTeam && invitationCount > 0 && (
              <div className="bg-yellow-900/20 rounded-lg p-1 animate-pulse">
                <button
                  onClick={() => navigate("/invitaciones")}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-2.5 px-4 rounded-md font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-200 text-sm flex items-center justify-center gap-2 border border-yellow-500/30 hover:border-yellow-400/50"
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Ver Invitaciones
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {invitationCount}
                  </span>
                </button>
              </div>
            )}

            {user?.rol === "jugador" && (
              <div className="bg-yellow-900/20 rounded-lg p-1">
                <button
                  onClick={async () => {
                    if (
                      window.confirm(
                        "¿Estás seguro de que quieres salir del equipo? Perderás tu historial en este equipo."
                      )
                    ) {
                      try {
                        const result = await userSearchService.leaveTeam();
                        alert(
                          result.message ||
                            "Has salido del equipo correctamente"
                        );
                        await refreshUser();
                        setTimeout(() => {
                          window.location.reload();
                        }, 1000);
                      } catch (error) {
                        alert(error.message || "Error al salir del equipo");
                      }
                    }
                  }}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-2.5 px-4 rounded-md font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-200 text-sm flex items-center justify-center gap-2"
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Salir del equipo
                </button>
              </div>
            )}
          </div>

          <hr className="border-green-800 mb-4" />

          {hasTeam && (
            <div className="mb-4 p-3 bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-300">
                  Jugadores en equipo:
                </span>
                <span className="font-bold text-white">
                  {teamData?.cantidad_jugadores ||
                    user.equipo?.cantidad_jugadores ||
                    1}
                  /5
                </span>
              </div>
              <div className="w-full bg-green-800/30 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      ((teamData?.cantidad_jugadores ||
                        user.equipo?.cantidad_jugadores ||
                        1) /
                        5) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-green-400 mt-2">
                {(teamData?.cantidad_jugadores ||
                  user.equipo?.cantidad_jugadores ||
                  1) === 5
                  ? "¡Equipo completo!"
                  : `Faltan ${
                      5 -
                      (teamData?.cantidad_jugadores ||
                        user.equipo?.cantidad_jugadores ||
                        1)
                    } jugadores`}
              </p>
            </div>
          )}

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
        hasTeam={hasTeam}
        currentTeamName={hasTeam ? user.equipo.nombre : ""}
      />

      <SendInvitationModal
        isOpen={isInvitationModalOpen}
        onClose={() => setIsInvitationModalOpen(false)}
      />
    </>
  );
}

export default Navbar;
