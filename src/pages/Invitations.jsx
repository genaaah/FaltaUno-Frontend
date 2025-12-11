import React, { useState } from "react";
import InvitationList from "../components/Invitations/InvitationList";
import SendInvitationModal from "../components/Invitations/SendInvitationModal";
import { useAuth } from "../context/AuthContext";

function Invitations() {
  const { user } = useAuth();
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const canSendInvitations = user?.rol === "capitan" && user?.equipoId !== null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <InvitationList />

        {canSendInvitations && (
          <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40">
            <button
              onClick={() => setIsSendModalOpen(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:from-green-500 hover:to-emerald-400 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label="Enviar invitación"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
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
            </button>
            <div className="hidden sm:block absolute bottom-full right-0 mb-2 w-max">
              <div className="bg-gray-800 text-white text-xs rounded-lg py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <span className="font-medium">Invitar jugadores</span>
                <div className="absolute top-full right-3 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <SendInvitationModal
          isOpen={isSendModalOpen}
          onClose={() => setIsSendModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default Invitations;
