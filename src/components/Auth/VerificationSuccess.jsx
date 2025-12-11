import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function VerificationSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
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
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          ¡Cuenta verificada exitosamente!
        </h2>

        <p className="text-gray-600 mb-6">
          Tu cuenta ha sido activada correctamente. Ahora puedes iniciar sesión.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-700">
            Serás redirigido automáticamente a la página de inicio de sesión en
            5 segundos...
          </p>
        </div>

        <button
          onClick={() => navigate("/auth")}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Ir al inicio de sesión ahora
        </button>
      </div>
    </div>
  );
}

export default VerificationSuccess;
