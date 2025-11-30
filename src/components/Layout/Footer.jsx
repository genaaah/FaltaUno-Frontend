import React, { useState } from "react";
import logo from "../../assets/logo-falta1.png";
import ContactModal from "./ContactModal";
import TermsModal from "./TermsModal";
import terms from '../../content/TERMS.md?raw';

function Footer() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-green-100 text-green-800 py-8 border-t-2 border-green-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Left side - Términos y Privacidad */}
            <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={() => setIsTermsModalOpen(true)}
                className="font-semibold hover:text-green-600 transition-colors text-sm"
              >
                Términos
              </button>
              <span className="text-green-800">•</span>
              <a
                href="#"
                className="font-semibold hover:text-green-600 transition-colors text-sm"
              >
                Privacidad
              </a>
            </div>

            {/* Center - Logo and Info */}
            <div className="flex flex-col items-center text-center">
              <img
                src={logo}
                alt="Logo Falta1"
                className="w-12 h-12 object-contain mb-2"
              />
              <p className="text-sm italic text-green-600 mb-1">
                Conectando equipos, creando competencia.
              </p>
              <p className="text-xs text-green-600">
                © 2025 Falta1 - Todos los derechos reservados
              </p>
            </div>

            {/* Right side - Contacto e Instagram */}
            <div className="flex flex-wrap justify-center gap-6 items-center">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="font-semibold hover:text-green-600 transition-colors text-sm"
              >
                Contacto
              </button>
              <span className="text-green-800">•</span>
              <a
                href="https://www.instagram.com/falta1_2025?igsh=eXZqN2xxcHppdGNo"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75 transition-opacity"
                title="Síguenos en Instagram"
              >
                <svg
                  className="w-6 h-6 text-green-600 hover:text-green-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        text={terms}
      />
    </>
  );
}

export default Footer;
