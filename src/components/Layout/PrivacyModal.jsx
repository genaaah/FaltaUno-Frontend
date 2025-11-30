import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function PrivacyModal({ isOpen, onClose, text }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-3xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 z-10"
        >
          &times;
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-4 text-center">
          Política de Privacidad
        </h2>

        <div className="text-sm text-gray-700 leading-relaxed max-h-[70vh] overflow-y-auto">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyModal;
