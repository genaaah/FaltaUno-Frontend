import React from "react";
import { useAuth } from "../context/AuthContext";
import VisibilityToggle from "../components/Profile/VisibilityToggle";
import InvitationList from "../components/Invitations/InvitationList";

function Profile() {
  const { user } = useAuth();

  const roleLabels = {
    admin: "Administrador",
    capitan: "Capitán",
    jugador: "Jugador",
    usuario: "Usuario",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-5 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-md mx-auto md:mx-0">
                {user?.nombre?.charAt(0)}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {user?.nombre} {user?.apellido}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1 break-all sm:break-normal">
                  {user?.correo_electronico}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 mt-4">
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full font-semibold text-xs sm:text-sm">
                    {roleLabels[user?.rol] || "Usuario"}
                  </span>

                  {user?.equipo && (
                    <>
                      <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 rounded-full font-semibold text-xs sm:text-sm">
                        Equipo: {user.equipo.nombre}
                      </span>
                      <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 rounded-full font-semibold text-xs sm:text-sm">
                        Jugadores: {user.equipo.cantidad_jugadores || 1}/5
                      </span>
                    </>
                  )}

                  <span
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm ${
                      user?.visible
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
                        : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800"
                    }`}
                  >
                    {user?.visible ? "👁️ Perfil visible" : "🙈 Perfil oculto"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <VisibilityToggle />
          {!user?.equipo && (
            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                Invitaciones pendientes
              </h2>
              <InvitationList />
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-5">
              Información del sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-xl p-4 sm:p-5">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
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
                  </div>
                  <h4 className="font-semibold text-blue-800 text-sm sm:text-base">
                    Sobre la visibilidad
                  </h4>
                </div>
                <ul className="text-xs sm:text-sm text-blue-700 space-y-1.5 sm:space-y-2 pl-2">
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>
                      Solo usuarios sin equipo pueden cambiar visibilidad
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>
                      Al unirte a un equipo, tu perfil se oculta automáticamente
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>
                      Los capitanes solo ven usuarios con visible=true
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>
                      Si tienes invitaciones pendientes, no puedes ocultarte
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-5">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-green-800 text-sm sm:text-base">
                    Sobre los equipos
                  </h4>
                </div>
                <ul className="text-xs sm:text-sm text-green-700 space-y-1.5 sm:space-y-2 pl-2">
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Máximo 5 jugadores por equipo</span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Solo el capitán puede invitar jugadores</span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>
                      Los jugadores pueden salir del equipo cuando quieran
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>
                      Los capitanes no pueden salir, deben eliminar el equipo
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>
                      Al aceptar invitación, se actualiza el contador
                      automáticamente
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
