import React from "react";

function InvitationCard({ invitation, onAccept, onReject, isLoading }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold">
              {invitation.creador.nombre.charAt(0)}
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">
                {invitation.creador.nombre} {invitation.creador.apellido}
              </h4>
              <p className="text-sm text-gray-600">
                Te invitó a unirte a su equipo
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
            <h5 className="font-bold text-green-800 text-lg mb-1">
              {invitation.equipo.nombre}
            </h5>
            <p className="text-sm text-green-600">
              Equipo • ID: {invitation.equipo.id}
            </p>
          </div>

          <div className="text-xs text-gray-500">
            Invitación enviada el {formatDate(invitation.creadoEn)}
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
            Pendiente
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onAccept(invitation.id)}
          disabled={isLoading}
          className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4 text-white"
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Aceptar
            </>
          )}
        </button>

        <button
          onClick={() => onReject(invitation.id)}
          disabled={isLoading}
          className="flex-1 bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Rechazar
        </button>
      </div>
    </div>
  );
}

export default InvitationCard;
