import React, { useState } from 'react';
import InvitationList from '../components/Invitations/InvitationList';
import SendInvitationModal from '../components/Invitations/SendInvitationModal';
import { useAuth } from '../context/AuthContext';

function Invitations() {
  const { user } = useAuth();
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const canSendInvitations = user?.rol === 'capitan' && user?.equipoId !== null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <InvitationList />
        
        {canSendInvitations && (
          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setIsSendModalOpen(true)}
              className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-full shadow-lg hover:from-green-500 hover:to-green-400 transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
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