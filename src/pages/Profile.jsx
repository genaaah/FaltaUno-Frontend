import React from "react";
import { useAuth } from "../context/AuthContext";
import VisibilityToggle from "../components/Profile/VisibilityToggle";
import InvitationList from "../components/Invitations/InvitationList";

function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user?.nombre?.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800">
                  {user?.nombre} {user?.apellido}
                </h1>
                <p className="text-gray-600 mt-1">{user?.correo_electronico}</p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
                    {user?.rol === "admin"
                      ? "Administrador"
                      : user?.rol === "capitan"
                      ? "Capitán"
                      : user?.rol === "jugador"
                      ? "Jugador"
                      : "Usuario"}
                  </span>
                  {user?.equipo && (
                    <>
                      <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
                        Equipo: {user.equipo.nombre}
                      </span>
                      <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-semibold">
                        Jugadores: {user.equipo.cantidad_jugadores || 1}/5
                      </span>
                    </>
                  )}
                  <span
                    className={`px-4 py-2 rounded-full font-semibold ${
                      user?.visible
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user?.visible ? "Perfil visible" : "Perfil oculto"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <VisibilityToggle />

          {!user?.equipo && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Invitaciones pendientes
              </h2>
              <InvitationList />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Información del sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Sobre la visibilidad
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Solo usuarios sin equipo pueden cambiar visibilidad</li>
                  <li>
                    • Al unirte a un equipo, tu perfil se oculta automáticamente
                  </li>
                  <li>• Los capitanes solo ven usuarios con visible=true</li>
                  <li>
                    • Si tienes invitaciones pendientes, no puedes ocultarte
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h4 className="font-semibold text-green-800 mb-2">
                  Sobre los equipos
                </h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Máximo 5 jugadores por equipo</li>
                  <li>• Solo el capitán puede invitar jugadores</li>
                  <li>
                    • Los jugadores pueden salir del equipo cuando quieran
                  </li>
                  <li>
                    • Los capitanes no pueden salir, deben eliminar el equipo
                  </li>
                  <li>
                    • Al aceptar invitación, se actualiza el contador
                    automáticamente
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
