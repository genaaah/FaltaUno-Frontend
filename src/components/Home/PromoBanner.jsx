import React from "react";

function PromoBanner() {
  return (
    <a
      href="https://www.opensports.com.ar/"
      target="_blank"
      rel="noopener noreferrer"
      className="block mb-6 group"
    >
      <div
        className="relative rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] overflow-hidden min-h-[120px] flex items-center"
        style={{
          backgroundImage:
            "url(https://plus.unsplash.com/premium_photo-1661912014730-cb332faa85ad?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNhbmNoYSUyMGRlJTIwZiVDMyVCQXRib2x8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 rounded-xl"></div>
        <div className="relative z-10 w-full text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold mb-3">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 5.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 10l1.293-1.293zm4 0a1 1 0 010 1.414L11.586 10l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              OFERTA EXCLUSIVA
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
              Hasta <span className="text-yellow-300">15% de descuento</span>
              <br />
              en todas tus compras
            </h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 inline-block border border-yellow-300/30">
              <p className="text-white text-sm md:text-base font-semibold">
                Código:{" "}
                <span className="text-yellow-300 font-bold text-base md:text-lg">
                  FALTA1
                </span>
              </p>
            </div>
            <div className="mt-3 flex justify-center">
              <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 flex items-center gap-1 shadow-md">
                Obtener Descuento
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      </div>
    </a>
  );
}

export default PromoBanner;
