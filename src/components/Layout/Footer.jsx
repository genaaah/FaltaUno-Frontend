import React, { useState } from "react";
import logo from "../../assets/logo-falta1.png";
import ContactModal from "./ContactModal";
import TermsModal from "./TermsModal";
import PrivacyModal from "./PrivacyModal";
import terms from "../../content/TERMS.md?raw";
import privacy from "../../content/PRIVACY.md?raw";

function Footer() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-gradient-to-b from-green-50 to-green-100 text-green-800 py-6 sm:py-8 border-t-2 border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 order-3 md:order-1">
              <button
                onClick={() => setIsTermsModalOpen(true)}
                className="font-medium hover:text-green-600 transition-colors duration-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded px-1"
                aria-label="Ver términos y condiciones"
              >
                Términos
              </button>
              <span className="text-green-600 hidden sm:inline">•</span>
              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="font-medium hover:text-green-600 transition-colors duration-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded px-1"
                aria-label="Ver política de privacidad"
              >
                Privacidad
              </button>
            </div>
            <div className="flex flex-col items-center text-center order-1 md:order-2">
              <img
                src={logo}
                alt="Logo Falta1"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain mb-2"
                loading="lazy"
              />
              <p className="text-xs sm:text-sm italic text-green-600 mb-1 max-w-xs">
                Conectando equipos, creando competencia.
              </p>
              <p className="text-xs text-green-600">
                © {currentYear} Falta1 - Todos los derechos reservados
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 items-center order-2 md:order-3">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="font-medium hover:text-green-600 transition-colors duration-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded px-1"
                aria-label="Abrir formulario de contacto"
              >
                Contacto
              </button>
              <span className="text-green-600 hidden sm:inline">•</span>
              <a
                href="https://www.instagram.com/falta1_2025?igsh=eXZqN2xxcHppdGNo"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-full p-1"
                title="Síguenos en Instagram"
                aria-label="Visita nuestro Instagram (se abre en nueva ventana)"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 hover:text-green-700 transition-colors duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-200 md:hidden text-center">
            <p className="text-xs text-green-600">
              Plataforma de gestión de equipos y torneos de fútbol
            </p>
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
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        text={privacy}
      />
    </>
  );
}

export default Footer;
