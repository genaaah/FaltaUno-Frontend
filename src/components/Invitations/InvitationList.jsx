import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { invitationService } from "../../services/invitationService";
import InvitationCard from "./InvitationCard";
import { sweetAlert } from "../../utils/sweetAlert";

function InvitationList() {
  const { user, refreshUser } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await invitationService.getInvitations();
      setInvitations(Array.isArray(data) ? data : []);
    } catch (error) {
      if (!error.message.includes("No se encontraron")) {
        setError(error.userMessage || "Error al cargar invitaciones");
      }
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId) => {
    const invitation = invitations.find((inv) => inv.id === invitationId);

    const result = await sweetAlert.confirm(
      "¿Unirse al equipo?",
      `¿Te unirás al equipo "${invitation?.equipo?.nombre}"?\n\nAl aceptar, otras invitaciones se rechazarán automáticamente.`,
      "Sí, unirse",
      "Cancelar"
    );

    if (!result.isConfirmed) {
      return;
    }

    setActionLoading(invitationId);
    try {
      await invitationService.acceptInvitation(invitationId);
      await refreshUser();

      await sweetAlert.success(
        "¡Te has unido al equipo!",
        `Ahora eres parte de "${invitation?.equipo?.nombre}"`
      );

      await fetchInvitations();
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      await sweetAlert.error(
        "Error",
        error.userMessage || "No se pudo aceptar la invitación"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (invitationId) => {
    const invitation = invitations.find((inv) => inv.id === invitationId);

    const result = await sweetAlert.confirm(
      "¿Rechazar invitación?",
      `¿Rechazar la invitación de ${invitation?.creador?.nombre} ${invitation?.creador?.apellido}?`,
      "Sí, rechazar",
      "Cancelar"
    );

    if (!result.isConfirmed) {
      return;
    }

    setActionLoading(invitationId);
    try {
      await invitationService.rejectInvitation(invitationId);
      await sweetAlert.success(
        "Invitación rechazada",
        "La invitación ha sido rechazada correctamente."
      );
      await fetchInvitations();
    } catch (error) {
      await sweetAlert.error(
        "Error",
        error.userMessage || "No se pudo rechazar la invitación"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16">
      <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-green-600"></div>
      <p className="mt-4 text-gray-600 text-sm sm:text-base">
        Cargando invitaciones...
      </p>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 px-4 sm:px-6">
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 mb-4">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
        No hay invitaciones
      </h3>
      <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
        Tu perfil debe estar visible para recibir invitaciones de equipos.
      </p>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Invitaciones
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2">
          Gestiona las invitaciones para unirte a equipos
        </p>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      {invitations.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-2.5">
              <p className="text-green-800 text-sm sm:text-base">
                Tienes <span className="font-bold">{invitations.length}</span>{" "}
                invitación{invitations.length !== 1 ? "es" : ""} pendiente
                {invitations.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={fetchInvitations}
              disabled={actionLoading}
              className="text-green-600 hover:text-green-800 font-medium flex items-center justify-center sm:justify-start gap-2 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Actualizar lista de invitaciones"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Actualizar lista
            </button>
          </div>

          {/* Lista de invitaciones */}
          <div className="space-y-4 sm:space-y-5">
            {invitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                onAccept={handleAccept}
                onReject={handleReject}
                isLoading={actionLoading === invitation.id}
              />
            ))}
          </div>

          <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 rounded-full flex items-center justify-center">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 text-base sm:text-lg mb-2 sm:mb-3">
                  Información importante
                </h4>
                <ul className="text-blue-600 text-sm sm:text-base space-y-1.5 sm:space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1.5">•</span>
                    <span>Solo puedes pertenecer a un equipo a la vez</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1.5">•</span>
                    <span>
                      Al aceptar una invitación, las demás se rechazarán
                      automáticamente
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1.5">•</span>
                    <span>
                      Tu perfil se oculta automáticamente al unirte a un equipo
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default InvitationList;
