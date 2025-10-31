import React from "react";
import logo from "../../assets/logo-falta1.png";

function Footer() {
  return (
    <footer className="bg-green-100 text-green-800 py-8 border-t-2 border-green-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="#"
              className="font-semibold hover:text-green-600 transition-colors"
            >
              Torneos
            </a>
            <a
              href="#"
              className="font-semibold hover:text-green-600 transition-colors"
            >
              Beneficios
            </a>
            <a
              href="#"
              className="font-semibold hover:text-green-600 transition-colors"
            >
              Términos
            </a>
          </div>
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
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="#"
              className="font-semibold hover:text-green-600 transition-colors"
            >
              Contacto
            </a>
            <a
              href="#"
              className="font-semibold hover:text-green-600 transition-colors"
            >
              Instagram
            </a>
            <a
              href="#"
              className="font-semibold hover:text-green-600 transition-colors"
            >
              Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
