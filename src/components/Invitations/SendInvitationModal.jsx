import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { invitationService } from "../../services/invitationService";
import { userSearchService } from "../../services/userSearchService";

function SendInvitationModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadAvailableUsers();
      setSearchQuery("");
      setError("");
      setSuccess("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim() === "") {
      loadAvailableUsers();
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(() => {
      searchAvailableUsers(searchQuery);
    }, 500);
  }, [searchQuery]);

  const loadAvailableUsers = async () => {
    try {
      setIsSearching(true);
      const users = await userSearchService.getAvailableUsers();

      const filteredUsers = users.filter(
        (u) => u.correo_electronico !== user?.correo_electronico
      );

      setAvailableUsers(filteredUsers);
    } catch (error) {
      console.error("Error loading available users:", error);
      setAvailableUsers([]);
      setError("No se pudieron cargar los usuarios disponibles");
    } finally {
      setIsSearching(false);
    }
  };

  const searchAvailableUsers = async (query) => {
    try {
      const users = await userSearchService.searchAvailableUsers(query);

      const filteredUsers = users.filter(
        (u) => u.correo_electronico !== user?.correo_electronico
      );

      setAvailableUsers(filteredUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      setAvailableUsers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInviteByEmail = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Ingresa el email del jugador a invitar");
      return;
    }
    const userToInvite = availableUsers.find(
      (u) => u.correo_electronico.toLowerCase() === searchQuery.toLowerCase()
    );

    if (!userToInvite) {
      setError(
        "Usuario no encontrado. Verifica que: 1) El email sea correcto, 2) El usuario tenga visible=true, 3) No tenga equipo."
      );
      return;
    }

    if (userToInvite.correo_electronico === user?.correo_electronico) {
      setError("No puedes invitarte a ti mismo");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await invitationService.sendInvitation(userToInvite.id);
      setSuccess(
        `¡Invitación enviada a ${userToInvite.nombre} ${userToInvite.apellido}!`
      );
      setSearchQuery("");

      setAvailableUsers((prev) => prev.filter((u) => u.id !== userToInvite.id));

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteUser = async (userToInvite) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await invitationService.sendInvitation(userToInvite.id);
      setSuccess(
        `¡Invitación enviada a ${userToInvite.nombre} ${userToInvite.apellido}!`
      );
      setSearchQuery("");

      setAvailableUsers((prev) => prev.filter((u) => u.id !== userToInvite.id));

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                Invitar Jugadores
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Invita jugadores a unirse a tu equipo:{" "}
                <strong>{user?.equipo?.nombre}</strong>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Jugadores disponibles: {availableUsers.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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
          </div>

          <form onSubmit={handleInviteByEmail} className="mb-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, apellido o email..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                />
                {isSearching && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? "Enviando..." : "Invitar"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
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
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
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
                {success}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-700">
                Jugadores disponibles ({availableUsers.length})
              </h4>
              <button
                type="button"
                onClick={loadAvailableUsers}
                disabled={isSearching}
                className="text-sm text-green-600 hover:text-green-800 font-semibold flex items-center gap-1 disabled:opacity-50"
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

            {isSearching && availableUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
                <p>Buscando jugadores...</p>
              </div>
            ) : availableUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto text-gray-300 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <p className="font-medium text-gray-700">
                  No hay jugadores disponibles
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Todos los usuarios están en equipos o no tienen visible=true
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {availableUsers.map((userItem) => (
                  <div
                    key={userItem.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold">
                        {userItem.nombre?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {userItem.nombre} {userItem.apellido}
                        </p>
                        <p className="text-sm text-gray-500">
                          {userItem.correo_electronico}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">
                            {userItem.rol || "usuario"}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                            Sin equipo
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleInviteUser(userItem)}
                      disabled={isLoading}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-1"
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Invitar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2">
              Información importante
            </h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-green-500 mt-0.5"
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
                <span>
                  Solo puedes invitar a usuarios con{" "}
                  <strong>visible=true</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-green-500 mt-0.5"
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
                <span>Los usuarios que ya están en equipos no aparecen</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-green-500 mt-0.5"
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
                <span>
                  Solo el <strong>capitán</strong> puede enviar invitaciones
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-green-500 mt-0.5"
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
                <span>
                  Límite de equipo: <strong>5 jugadores</strong> máximo
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendInvitationModal;
