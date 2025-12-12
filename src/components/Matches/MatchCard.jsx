import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { matchesService } from "../../services/matchesService";
import { sweetAlert } from "../../utils/sweetAlert";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("es-ES");
};

const normalizeEstado = (raw) => {
  if (!raw && raw !== "") return "";
  return String(raw).toLowerCase();
};

const IconLoader = ({ size = "w-4 h-4" }) => (
  <svg
    className={`animate-spin ${size} text-white`}
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
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

const IconCheck = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
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
);

const IconExit = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
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
);

const IconPlus = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const IconEdit = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const IconClose = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
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
);

const IconTrash = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const StatusBadge = ({ estado }) => {
  const statusConfig = useMemo(() => {
    const config = {
      sin_cargar: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Pendiente",
      },
      confirmacion_pendiente: {
        color: "bg-blue-100 text-blue-800",
        label: "Confirmación pendiente",
      },
      confirmado: { color: "bg-green-100 text-green-800", label: "Confirmado" },
      indefinido: {
        color: "bg-red-100 text-red-800",
        label: "Resultado rechazado",
      },
    };
    return (
      config[normalizeEstado(estado)] || {
        color: "bg-gray-100 text-gray-800",
        label: estado || "Desconocido",
      }
    );
  }, [estado]);

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}
    >
      {statusConfig.label}
    </span>
  );
};

const RoleBadge = ({ type }) => {
  const badges = {
    creator: { text: "Creador", color: "bg-purple-100 text-purple-800" },
    visitor: { text: "Visitante", color: "bg-blue-100 text-blue-800" },
  };

  const badge = badges[type];
  if (!badge) return null;

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${badge.color}`}
    >
      {badge.text}
    </span>
  );
};

const TeamCard = ({ team, isLocal, isUserTeam, teamName, score }) => {
  const bgColor = isUserTeam
    ? isLocal
      ? "bg-green-50 border border-green-200"
      : "bg-blue-50 border border-blue-200"
    : "bg-gray-50";

  const circleColor = isUserTeam
    ? isLocal
      ? "bg-green-600 text-white"
      : "bg-blue-600 text-white"
    : "bg-gray-200 text-gray-800";

  return (
    <div className={`p-4 rounded-lg ${bgColor}`}>
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${circleColor}`}
        >
          {String(teamName || "?").charAt(0) || "?"}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{teamName}</p>
          <p className="text-xs text-gray-500">
            {isLocal ? "Local" : "Visitante"}
          </p>
          {isUserTeam && (
            <p
              className={`text-xs ${
                isLocal ? "text-green-600" : "text-blue-600"
              }`}
            >
              (Tú)
            </p>
          )}
        </div>
      </div>
      {!team && !isLocal && (
        <p className="text-xs text-gray-500 italic mt-2">Esperando equipo...</p>
      )}
    </div>
  );
};

const ActionButton = ({
  onClick,
  loading,
  children,
  variant = "primary",
  icon,
  fullWidth = true,
  className = "",
}) => {
  const variants = {
    primary: "bg-green-600 hover:bg-green-700",
    secondary: "bg-blue-600 hover:bg-blue-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    danger: "bg-red-600 hover:bg-red-700",
  };

  const buttonClass = `
    ${fullWidth ? "flex-1 min-w-[200px]" : ""}
    ${variants[variant] || variants.primary}
    text-white py-2.5 px-4 rounded-lg font-semibold 
    transition-colors disabled:opacity-60 disabled:cursor-not-allowed 
    flex items-center justify-center gap-2 ${className}
  `;

  return (
    <button onClick={onClick} disabled={loading} className={buttonClass}>
      {loading ? (
        <>
          <IconLoader size="w-4 h-4" />{" "}
          {children.includes("...") ? children : `${children}...`}
        </>
      ) : (
        <>
          {icon} {children}
        </>
      )}
    </button>
  );
};

const SecondaryButton = ({
  onClick,
  children,
  disabled = false,
  className = "",
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const useMatchPermissions = (match, user) => {
  return useMemo(() => {
    const estado = normalizeEstado(match.estado);
    const isCreator = match.creadorLocalId === user?.id;
    const isVisitorCaptain = match.creadorVisitanteId === user?.id;
    const hasVisitor = Boolean(match.equipoVisitanteId);
    const isLocalCaptain = match.equipoLocalId === user?.equipoId && isCreator;

    return {
      isCreator,
      isLocalCaptain,
      isVisitorCaptain,
      canJoin:
        !hasVisitor &&
        user?.rol === "capitan" &&
        user?.equipoId &&
        user.equipoId !== match.equipoLocalId,
      canLeave:
        isVisitorCaptain &&
        estado === "sin_cargar" &&
        user?.equipoId === match.equipoVisitanteId,
      canLocalLeave: isLocalCaptain && estado === "sin_cargar" && hasVisitor,
      canUpdateResult: isCreator && estado === "sin_cargar" && hasVisitor,
      canConfirmResult: isVisitorCaptain && estado === "confirmacion_pendiente",
      canRejectResult: isVisitorCaptain && estado === "confirmacion_pendiente",
      canDelete: isCreator && estado === "sin_cargar",
      estado,
      hasVisitor,
    };
  }, [match, user]);
};

const useMatchActions = (matchId, onUpdate) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const executeWithLoading = async (actionFn, successTitle, successMsg) => {
    setIsLoading(true);
    try {
      await actionFn();
      if (successTitle)
        await sweetAlert.success(successTitle, successMsg || "");
      if (onUpdate) onUpdate();
    } catch (err) {
      await sweetAlert.error("Error", err.message || "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user?.equipoId) {
      await sweetAlert.error(
        "Sin equipo",
        "Necesitas tener un equipo para unirte a un partido"
      );
      return;
    }

    const confirm = await sweetAlert.confirm(
      "¿Unirse al partido?",
      `¿Unir tu equipo "${user?.equipo?.nombre}" al partido?`,
      "Sí, unirse",
      "Cancelar"
    );
    if (!confirm.isConfirmed) return;

    await executeWithLoading(
      () => matchesService.joinMatch(matchId),
      "¡Te has unido!",
      "Ahora formas parte del partido"
    );
  };

  const handleLeaveMatch = async (teamType) => {
    const isLocal = teamType === "local";
    const confirm = await sweetAlert.confirm(
      isLocal ? "¿Abandonar partido?" : "¿Salir del partido?",
      isLocal
        ? "¿Abandonar el partido como equipo local?\n\nEl equipo visitante pasará a ser local y el partido quedará abierto."
        : "¿Salir del partido como equipo visitante?\n\nEsta acción no se puede deshacer.",
      isLocal ? "Sí, abandonar" : "Sí, salir",
      "Cancelar"
    );
    if (!confirm.isConfirmed) return;

    await executeWithLoading(
      () => matchesService.leaveMatch(matchId),
      isLocal ? "Has abandonado el partido" : "Has salido del partido",
      isLocal
        ? "El equipo visitante ahora es local y el partido está abierto."
        : ""
    );
  };

  const handleDelete = async () => {
    const confirm = await sweetAlert.confirmCritical(
      "¿Eliminar partido?",
      "¿Eliminar el partido?\n\nEsta acción no se puede deshacer.",
      "Sí, eliminar",
      "Cancelar"
    );
    if (!confirm.isConfirmed) return;

    await executeWithLoading(
      () => matchesService.deleteMatch(matchId),
      "Partido eliminado"
    );
  };

  return { isLoading, handleJoin, handleLeaveMatch, handleDelete };
};

const MatchHeader = ({ match, permissions }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
    <div>
      <h4 className="font-bold text-gray-800 text-lg sm:text-xl">
        {match.cancha?.nombre || match.cancha || "Cancha"}
      </h4>
      <p className="text-gray-600 text-sm sm:text-base">
        {match.fecha} • {match.hora}
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
      <StatusBadge estado={permissions.estado} />
      {permissions.isCreator && <RoleBadge type="creator" />}
      {permissions.isVisitorCaptain && <RoleBadge type="visitor" />}
    </div>
  </div>
);

const LocalWarning = ({ permissions }) => {
  if (!permissions.isLocalCaptain || !permissions.hasVisitor) return null;

  return (
    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
      ⚠️ <span className="font-semibold">Eres el equipo local.</span> Si
      abandonas el partido, el equipo visitante pasará a ser local y el partido
      quedará abierto para que entre otro equipo.
    </div>
  );
};

const TeamsSection = ({ match, permissions }) => {
return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    <TeamCard
      team={match.equipoLocal}
      isLocal
      isUserTeam={permissions.isCreator}
      teamName={match.equipoLocal}
      score={match.golesLocal}
    />
    <div className="flex items-center justify-center order-first md:order-none">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-300 mb-1">VS</div>
        {permissions.estado === "sin_cargar" && !permissions.hasVisitor && (
          <div className="text-xs text-yellow-600 font-medium px-3 py-1 bg-yellow-50 rounded-full">
            Buscando rival
          </div>
        )}
        {(match.golesLocal !== null && 
          match.golesVisitante !== null &&
          (match.estado === 'confirmado' || match.estado === 'indefinido')) && (
            <div className="text-lg font-bold text-gray-800">
              {match.golesLocal} - {match.golesVisitante}
            </div>
        )}
      </div>
    </div>
    <TeamCard
      team={match.equipoVisitante}
      isLocal={false}
      isUserTeam={permissions.isVisitorCaptain}
      teamName={match.equipoVisitante}
      score={match.golesVisitante}
    />
  </div>
)
};

const ResultForm = ({
  match,
  onSubmit,
  onCancel,
  isLoading,
  resultData,
  setResultData,
}) => (
  <form
    onSubmit={onSubmit}
    className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {match.equipoLocal}
        </label>
        <input
          type="number"
          min="0"
          value={resultData.goles_local}
          onChange={(e) =>
            setResultData((p) => ({
              ...p,
              goles_local: parseInt(e.target.value, 10) || 0,
            }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {match.equipoVisitante || "Rival"}
        </label>
        <input
          type="number"
          min="0"
          value={resultData.goles_visitante}
          onChange={(e) =>
            setResultData((p) => ({
              ...p,
              goles_visitante: parseInt(e.target.value, 10) || 0,
            }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>
    </div>
    <div className="flex flex-col sm:flex-row gap-2">
      <ActionButton
        type="submit"
        loading={isLoading}
        variant="primary"
        icon={<IconCheck />}
      >
        Cargar Resultado
      </ActionButton>
      <SecondaryButton onClick={onCancel} disabled={isLoading}>
        Cancelar
      </SecondaryButton>
    </div>
  </form>
);

const MatchFooter = ({ match }) => (
  <div className="mt-3 pt-3 border-t border-gray-100">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 gap-1">
      <span>Creado: {formatDate(match.creadoEn)}</span>
      {match.actualizadoEn && match.actualizadoEn !== match.creadoEn && (
        <span>Actualizado: {formatDate(match.actualizadoEn)}</span>
      )}
    </div>
  </div>
);

function MatchCard({ match: rawMatch, onUpdate, isMyMatch = false }) {
  const { user } = useAuth();
  const match = useMemo(() => ({ ...rawMatch }), [rawMatch]);
  const permissions = useMatchPermissions(match, user);
  const { isLoading, handleJoin, handleLeaveMatch, handleDelete } =
    useMatchActions(match.id, onUpdate);

  const [showResultForm, setShowResultForm] = useState(false);
  const [resultData, setResultData] = useState({
    goles_local: match.golesLocal ?? 0,
    goles_visitante: match.golesVisitante ?? 0,
  });

  const handleResultAction = async (actionFn, title, message) => {
    const confirm = await sweetAlert.confirm(title, message, "Sí", "Cancelar");
    if (!confirm.isConfirmed) return;

    try {
      await actionFn();
      await sweetAlert.success("Hecho", "");
      if (onUpdate) onUpdate();
    } catch (err) {
      await sweetAlert.error("Error", err.message || "Ocurrió un error");
    }
  };

  const handleResultSubmit = async (e) => {
    e.preventDefault();
    await handleResultAction(
      () => matchesService.updateResult(match.id, resultData),
      "¿Cargar resultado?",
      `¿Cargar resultado ${resultData.goles_local} - ${resultData.goles_visitante}?`
    );
    setShowResultForm(false);
  };

  const handleConfirmResult = async () => {
    await handleResultAction(
      () => matchesService.confirmResult(match.id),
      "¿Confirmar resultado?",
      `¿Confirmar resultado ${match.golesLocal} - ${match.golesVisitante}?`
    );
  };

  const handleRejectResult = async () => {
    await handleResultAction(
      () => matchesService.rejectResult(match.id),
      "¿Rechazar resultado?",
      `¿Rechazar resultado ${match.golesLocal} - ${match.golesVisitante}?\n\nSe deberán cargar nuevos resultados.`
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-4">
        <div className="flex-1">
          <MatchHeader match={match} permissions={permissions} />

          {(match.estado !== 'confirmado' && match.estado !== 'indefinido' && match.estado !== 'confirmacion_pendiente') ? 
            <LocalWarning permissions={permissions} /> : null}

          <TeamsSection match={match} permissions={permissions} />
        </div>
      </div>

      {showResultForm && permissions.isCreator && (
        <ResultForm
          match={match}
          onSubmit={handleResultSubmit}
          onCancel={() => setShowResultForm(false)}
          isLoading={isLoading}
          resultData={resultData}
          setResultData={setResultData}
        />
      )}

      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
        {permissions.canLocalLeave && (
          <div className="relative group">
            <ActionButton
              onClick={() => handleLeaveMatch("local")}
              loading={isLoading}
              variant="warning"
              icon={<IconExit />}
              className="relative"
            >
              Abandonar Partido
            </ActionButton>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
              Si abandonas, el equipo visitante pasará a ser local y el partido
              quedará abierto para nuevos equipos.
            </div>
          </div>
        )}

        {permissions.canLeave && !permissions.isLocalCaptain && (
          <ActionButton
            onClick={() => handleLeaveMatch("visitor")}
            loading={isLoading}
            variant="warning"
            icon={<IconExit />}
          >
            Salir del Partido
          </ActionButton>
        )}

        {permissions.canJoin && (
          <ActionButton
            onClick={handleJoin}
            loading={isLoading}
            variant="primary"
            icon={<IconPlus />}
          >
            Unirse al Partido
          </ActionButton>
        )}

        {permissions.canUpdateResult && (
          <ActionButton
            onClick={() => setShowResultForm((s) => !s)}
            loading={isLoading}
            variant="secondary"
            icon={<IconEdit />}
          >
            {showResultForm ? "Cancelar" : "Cargar Resultado"}
          </ActionButton>
        )}

        {permissions.canConfirmResult && (
          <ActionButton
            onClick={handleConfirmResult}
            loading={isLoading}
            variant="primary"
            icon={<IconCheck />}
          >
            Confirmar Resultado
          </ActionButton>
        )}

        {permissions.canRejectResult && (
          <ActionButton
            onClick={handleRejectResult}
            loading={isLoading}
            variant="danger"
            icon={<IconClose />}
          >
            Rechazar Resultado
          </ActionButton>
        )}

        {permissions.canDelete && (
          <ActionButton
            onClick={handleDelete}
            loading={isLoading}
            variant="danger"
            icon={<IconTrash />}
          >
            Eliminar Partido
          </ActionButton>
        )}
      </div>

      <MatchFooter match={match} />
    </div>
  );
}

export default MatchCard;
