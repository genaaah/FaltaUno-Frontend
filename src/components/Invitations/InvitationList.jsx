import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { invitationService } from "../../services/invitationService";
import { teamService } from "../../services/teamService";
import InvitationCard from "./InvitationCard";

function InvitationList() {
  const { user, updateUserTeam, refreshUser } = useAuth();
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

      if (Array.isArray(data)) {
        setInvitations(data);
      } else if (data && Array.isArray(data.data)) {
        setInvitations(data.data);
      } else {
        setInvitations([]);
      }
    } catch (error) {
      if (
        error.message !== "Error al obtener invitaciones" &&
        !error.message.includes("No se encontraron invitaciones")
      ) {
        setError(error.message);
      }
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId) => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres unirte a este equipo? Al aceptar, rechazarás automáticamente otras invitaciones pendientes."
      )
    ) {
      return;
    }

    setActionLoading(invitationId);
    try {
      await invitationService.acceptInvitation(invitationId);

      const updatedUser = await refreshUser();

      if (updatedUser) {
        const acceptedInvitation = invitations.find(
          (inv) => inv.id === invitationId
        );
        if (acceptedInvitation) {
          alert(
            `¡Te has unido a ${acceptedInvitation.equipo.nombre} exitosamente!`
          );
        }
      }

      await fetchInvitations();

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (invitationId) => {
    if (
      !window.confirm("¿Estás seguro de que quieres rechazar esta invitación?")
    ) {
      return;
    }

    setActionLoading(invitationId);
    try {
      await invitationService.rejectInvitation(invitationId);
      await fetchInvitations();
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Cargando invitaciones...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Invitaciones</h1>
        <p className="text-gray-600 mt-2">
          Gestiona las invitaciones para unirte a equipos
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {invitations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No tienes invitaciones pendientes
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Cuando un capitán te invite a unirte a su equipo, aparecerá aquí.
            Asegúrate de tener tu perfil visible.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-600">
              Tienes{" "}
              <span className="font-bold text-green-600">
                {invitations.length}
              </span>{" "}
              invitación{invitations.length !== 1 ? "es" : ""} pendiente
              {invitations.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={fetchInvitations}
              className="text-green-600 hover:text-green-800 font-semibold flex items-center gap-2"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Actualizar
            </button>
          </div>

          <div className="space-y-4">
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

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-500 mt-0.5"
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
              <div>
                <h4 className="font-semibold text-blue-800">Importante</h4>
                <p className="text-blue-600 text-sm mt-1">
                  • Al aceptar una invitación, automáticamente rechazarás todas
                  las otras invitaciones pendientes.
                  <br />
                  • Solo puedes pertenecer a un equipo a la vez.
                  <br />• Tu perfil se ocultará automáticamente al unirte a un
                  equipo.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default InvitationList;
