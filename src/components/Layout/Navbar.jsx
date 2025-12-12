import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { invitationService } from "../../services/invitationService";
import { teamService } from "../../services/teamService";
import { userSearchService } from "../../services/userSearchService";
import { sweetAlert } from "../../utils/sweetAlert";
import logo from "../../assets/logo-falta1.png";
import CreateTeamModal from "./CreateTeamModal";
import SendInvitationModal from "../Invitations/SendInvitationModal";
import VisibilityToggle from "../Profile/VisibilityToggle";

function Navbar() {
  const { user, logout, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);
  const [invitationCount, setInvitationCount] = useState(0);
  const [teamData, setTeamData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!hasTeam) {
          try {
            const invitations = await invitationService.getInvitations();
            setInvitationCount(invitations.length || 0);
          } catch (invitationError) {
            if (!invitationError.message?.includes("No se encontraron")) {
              console.warn("Error al cargar invitaciones:", invitationError);
            }
            setInvitationCount(0);
          }
        } else {
          setInvitationCount(0);

          try {
            const teamInfo = await teamService.getTeamById(user.equipoId);
            setTeamData(teamInfo);

            if (
              teamInfo.cantidad_jugadores !== user.equipo?.cantidad_jugadores
            ) {
              refreshUser();
            }
          } catch (teamError) {
            console.warn("No se pudo obtener datos del equipo:", teamError);
          }
        }
      } catch (error) {
        console.error("Error en fetchData:", error);
        setInvitationCount(0);
      }
    };

    if (user) {
      fetchData();

      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [user, refreshUser]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const isActive = (path) => {
    return location.pathname === path ? "bg-green-900 text-green-300" : "";
  };

  const hasTeam = user?.equipo !== null;
  const fullName = user ? `${user.nombre} ${user.apellido}` : "";
  const isCaptain = user?.rol === "capitan";
  const isAdmin = user?.rol === "admin";
  const isUsuario = user?.rol === "usuario";

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLeaveTeam = async () => {
    const result = await sweetAlert.confirm(
      "¿Salir del equipo?",
      `¿Estás seguro de que quieres salir del equipo "${user.equipo?.nombre}"?\n\n` +
        `⚠️ Al salir:\n` +
        `• Perderás acceso al historial del equipo\n` +
        `• Tu perfil será visible para recibir nuevas invitaciones`,
      "Sí, salir",
      "Cancelar"
    );

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await userSearchService.leaveTeam();

      await sweetAlert.success(
        "Has salido del equipo",
        response.message ||
          "Ahora tu perfil está visible para recibir nuevas invitaciones."
      );

      await refreshUser();

      setIsMobileMenuOpen(false);

      navigate("/");

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error al salir del equipo:", error);
      await sweetAlert.error(
        "Error",
        error.userMessage ||
          error.message ||
          "No se pudo salir del equipo. Intenta nuevamente."
      );
    }
  };

  const TeamProgress = () => {
    const playerCount =
      teamData?.cantidad_jugadores || user.equipo?.cantidad_jugadores || 1;
    const progressPercentage = Math.min((playerCount / 5) * 100, 100);

    return (
      <div className="mb-4 p-3 bg-green-900/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm text-green-300">
            Jugadores en equipo:
          </span>
          <span className="font-bold text-white text-sm sm:text-base">
            {playerCount}/5
          </span>
        </div>
        <div className="w-full bg-green-800/30 rounded-full h-1.5 sm:h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
            style={{
              width: `${progressPercentage}%`,
            }}
          ></div>
        </div>
        <p className="text-xs text-green-400 mt-2">
          {playerCount === 5
            ? "¡Equipo completo!"
            : `Faltan ${5 - playerCount} jugadores`}
        </p>
      </div>
    );
  };

  const MobileMenuButton = () => (
    <button
      onClick={toggleMobileMenu}
      className="lg:hidden fixed top-4 left-4 z-50 bg-green-950 text-white p-3 rounded-lg shadow-lg"
      aria-label="Abrir menú"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );

  const TeamStatus = () => {
    if (hasTeam) {
      return (
        <div className="mt-1 text-center">
          <p className="text-green-200 text-xs sm:text-sm">Equipo</p>
          <span className="font-bold text-white block truncate max-w-full">
            {user.equipo.nombre}
          </span>
          <p className="text-green-300 text-xs mt-0.5">ID: {user.equipo.id}</p>
        </div>
      );
    }

    if (user?.rol === "usuario") {
      return (
        <div className="mt-1 text-center">
          <p className="text-gray-300 text-xs sm:text-sm">Sin equipo</p>
          <p className="text-green-300 text-xs mt-1">
            {invitationCount > 0
              ? `${invitationCount} invitación${
                  invitationCount !== 1 ? "es" : ""
                } pendiente${invitationCount !== 1 ? "s" : ""}`
              : "Busca o crea un equipo"}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <MobileMenuButton />

      <nav
        className={`
        fixed lg:relative inset-y-0 left-0 z-40
        w-64 bg-green-950 text-green-100 p-4 sm:p-6
        flex flex-col justify-between rounded-r-2xl
        h-screen lg:h-auto
        transform transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        lg:sticky lg:top-0 overflow-y-auto
      `}
      >
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden absolute top-4 right-4 text-green-300 hover:text-white"
          aria-label="Cerrar menú"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex-1">
          <div className="flex flex-col items-center gap-3 mb-6">
            <img
              src={logo}
              alt="Logo Falta1"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
            />

            <div className="text-center">
              <p className="font-bold text-white text-base sm:text-lg truncate max-w-full">
                {fullName}
              </p>
              <p className="text-green-300 text-xs sm:text-sm">
                {getUserRole()}
              </p>
            </div>

            <TeamStatus />

            {hasTeam ? (
              <div className="mt-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-700 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  {user.equipo.nombre.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : isUsuario ? (
              <div className="mt-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-gray-300 font-bold">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
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
            ) : null}

            {isUsuario && !hasTeam && (
              <div className="mt-3 w-full px-2">
                <VisibilityToggle compact={true} />
              </div>
            )}
          </div>

          <hr className="border-green-800 mb-4 sm:mb-6" />

          <ul className="space-y-1 sm:space-y-2">
            {[
              { path: "/", label: "Inicio" },
              { path: "/game", label: "Jugar" },
              {
                path: "/invitaciones",
                label: "Invitaciones",
                showBadge: !hasTeam,
                badgeCount: invitationCount,
              },
              // Solo mostrar "Canchas" si el usuario es admin
              ...(isAdmin ? [{ path: "/canchas", label: "Canchas" }] : []),
              { path: "/perfil", label: "Mi Perfil" },
            ].map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors hover:bg-green-900 hover:text-green-300 text-sm sm:text-base ${isActive(
                    item.path
                  )} relative`}
                >
                  {item.label}
                  {item.showBadge && item.badgeCount > 0 && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {item.badgeCount > 9 ? "9+" : item.badgeCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <hr className="border-green-800 my-4 sm:my-6" />

          <ul className="space-y-1 sm:space-y-2">
            {[
              { path: "/store", label: "Tienda" },
              { path: "#", label: "Beneficios", disabled: true },
            ].map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    if (item.disabled) {
                      sweetAlert.info(
                        "Próximamente",
                        "Esta funcionalidad estará disponible pronto"
                      );
                      return;
                    }
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors hover:bg-green-900 hover:text-green-300 text-sm sm:text-base ${
                    item.disabled ? "opacity-50 cursor-not-allowed" : ""
                  } ${isActive(item.path)}`}
                  disabled={item.disabled}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 sm:mt-6">
          {!hasTeam && invitationCount > 0 && (
            <div className="mb-3 bg-yellow-900/20 rounded-lg p-1 animate-pulse">
              <button
                onClick={() => {
                  navigate("/invitaciones");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-md font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-200 text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 border border-yellow-500/30 hover:border-yellow-400/50 active:scale-[0.98]"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                Ver Invitaciones ({invitationCount})
              </button>
            </div>
          )}

          <div className="space-y-2 sm:space-y-3 mb-4">
            {/* Mostrar botón solo si es usuario sin equipo o capitán con equipo */}
            {(isUsuario && !hasTeam) || (isCaptain && hasTeam) ? (
              <div className="bg-green-900/50 rounded-lg p-1">
                <button
                  onClick={() => {
                    setIsTeamModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-md font-semibold hover:from-green-600 hover:to-green-500 transition-all duration-200 text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg hover:shadow-green-900/30 active:scale-[0.98]"
                >
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
            ) : null}
            
            {/* Mostrar "Invitar Jugadores" solo si es capitán con equipo */}
            {isCaptain && hasTeam && (
              <div className="bg-green-900/30 rounded-lg p-1">
                <button
                  onClick={() => {
                    setIsInvitationModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-green-800 to-green-700 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-md font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 border border-green-600/30 hover:border-green-500/50 active:scale-[0.98]"
                >
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                  Invitar Jugadores
                </button>
              </div>
            )}
            
            {/* Mostrar "Salir del equipo" solo si es jugador con equipo */}
            {user?.rol === "jugador" && hasTeam && (
              <div className="bg-yellow-900/20 rounded-lg p-1">
                <button
                  onClick={handleLeaveTeam}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-md font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-200 text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.98]"
                >
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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

          {hasTeam && <TeamProgress />}

          <hr className="border-green-800 mb-3 sm:mb-4" />
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold hover:from-red-500 hover:to-red-400 transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-red-900/30 active:scale-[0.98]"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}
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