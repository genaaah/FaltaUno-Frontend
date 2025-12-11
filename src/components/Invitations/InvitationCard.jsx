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

  const LoadingSpinner = ({ size = "h-4 w-4", color = "text-white" }) => (
    <svg
      className={`animate-spin ${size} ${color}`}
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
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-green-800 font-bold text-sm sm:text-base">
                {invitation.creador.nombre.charAt(0)}
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                {invitation.creador.nombre} {invitation.creador.apellido}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                Te invitó a unirte a su equipo
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <h5 className="font-bold text-green-800 text-base sm:text-lg mb-1 truncate">
              {invitation.equipo.nombre}
            </h5>
            <p className="text-xs sm:text-sm text-green-600">
              Equipo • ID: {invitation.equipo.id}
            </p>
          </div>
          <div className="text-xs text-gray-500">
            Invitación enviada el {formatDate(invitation.creadoEn)}
          </div>
        </div>
        <div className="hidden sm:block flex-shrink-0">
          <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full whitespace-nowrap">
            Pendiente
          </span>
        </div>
      </div>
      <div className="sm:hidden mt-2">
        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
          Pendiente
        </span>
      </div>

      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5 pt-4 border-t border-gray-100">
        <button
          onClick={() => onAccept(invitation.id)}
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-green-600 disabled:hover:to-emerald-600 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
          aria-label="Aceptar invitación"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="text-xs sm:text-sm">Aceptando...</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 flex-shrink-0"
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
              <span className="text-xs sm:text-sm">Aceptar</span>
            </>
          )}
        </button>

        <button
          onClick={() => onReject(invitation.id)}
          disabled={isLoading}
          className="flex-1 bg-gray-100 text-gray-800 py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed border border-gray-300 flex items-center justify-center gap-2 active:scale-[0.98]"
          aria-label="Rechazar invitación"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
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
          <span className="text-xs sm:text-sm">Rechazar</span>
        </button>
      </div>
    </div>
  );
}

export default InvitationCard;
