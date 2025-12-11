import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function VerificationSuccess() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/auth");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/auth");
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  const handleManualRedirect = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-auto text-center">
        <div className="mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
          ¡Cuenta verificada exitosamente!
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-5 sm:mb-6 leading-relaxed">
          Tu cuenta ha sido activada correctamente. Ahora puedes iniciar sesión.
        </p>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-5 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 border-green-300 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-bold text-sm sm:text-base">
                {seconds}
              </span>
            </div>
            <p className="text-sm sm:text-base text-green-700 font-medium">
              Redirigiendo en...
            </p>
          </div>
          <p className="text-xs sm:text-sm text-green-600">
            Serás redirigido automáticamente a la página de inicio de sesión
          </p>
        </div>
        <button
          onClick={handleManualRedirect}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] group"
        >
          <span className="text-sm sm:text-base">
            Ir al inicio de sesión ahora
          </span>
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
        <button
          onClick={() => navigate("/")}
          className="mt-4 sm:mt-5 text-green-600 hover:text-green-800 font-medium text-xs sm:text-sm transition-colors duration-200"
        >
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default VerificationSuccess;
