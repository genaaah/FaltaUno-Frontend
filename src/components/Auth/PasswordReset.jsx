import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";
import { sweetAlert } from "../../utils/sweetAlert";

function PasswordReset() {
  const [step, setStep] = useState("loading");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const urlToken = queryParams.get("token");

        if (!urlToken) {
          setStep("error");
          sweetAlert.error("Error", "Enlace de recuperación inválido");
          return;
        }

        setToken(urlToken);
        setStep("form");
      } catch (error) {
        setStep("error");
        sweetAlert.error("Error", "Error al procesar el enlace");
      }
    };

    validateToken();
  }, [location]);

  const validatePassword = (password) => {
    if (!password) return "La contraseña es requerida.";
    if (password.length < 8) return "Mínimo 8 caracteres.";
    if (!/[A-Z]/.test(password)) return "Al menos una mayúscula.";
    if (!/[a-z]/.test(password)) return "Al menos una minúscula.";
    if (!/\d/.test(password)) return "Al menos un número.";
    if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password))
      return "Al menos un carácter especial.";
    return "";
  };

  const validateConfirm = (confirm, password) => {
    if (!confirm) return "Confirmá la contraseña.";
    return confirm === password ? "" : "Las contraseñas no coinciden.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(newPassword);
    const confirmError = validateConfirm(confirmPassword, newPassword);

    setErrors({
      newPassword: passwordError,
      confirmPassword: confirmError,
    });

    if (passwordError || confirmError) return;

    setIsLoading(true);

    try {
      const result = await authService.resetPassword(
        token,
        newPassword,
        confirmPassword
      );

      await sweetAlert.success(
        "¡Contraseña cambiada!",
        "Ahora puedes iniciar sesión con tu nueva contraseña."
      );

      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (error) {
      await sweetAlert.error(
        "Error",
        error.message || "No se pudo cambiar la contraseña"
      );

      if (
        error.message.includes("inválido") ||
        error.message.includes("expirado")
      ) {
        setTimeout(() => {
          navigate("/auth");
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <svg
                className="w-8 h-8 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Verificando enlace...
          </h2>
          <p className="text-gray-600">Por favor espera.</p>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <svg
                className="w-8 h-8"
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
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Enlace inválido
          </h2>
          <p className="text-gray-600 mb-6">
            El enlace de recuperación no es válido o ha expirado.
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Ir al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Nueva Contraseña
          </h2>
          <p className="text-gray-600">
            Creá una nueva contraseña para tu cuenta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="reset-new-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nueva contraseña
              </label>
              <input
                type="password"
                id="reset-new-password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors({
                    ...errors,
                    newPassword: validatePassword(e.target.value),
                    confirmPassword: validateConfirm(
                      confirmPassword,
                      e.target.value
                    ),
                  });
                }}
                placeholder="********"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.newPassword ? "border-red-400" : "border-gray-300"
                }`}
                disabled={isLoading}
                required
              />
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="reset-confirm-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                id="reset-confirm-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors({
                    ...errors,
                    confirmPassword: validateConfirm(
                      e.target.value,
                      newPassword
                    ),
                  });
                }}
                placeholder="********"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.confirmPassword ? "border-red-400" : "border-gray-300"
                }`}
                disabled={isLoading}
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={
              isLoading ||
              !newPassword ||
              !confirmPassword ||
              errors.newPassword ||
              errors.confirmPassword
            }
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Cambiando...
              </>
            ) : (
              "Cambiar contraseña"
            )}
          </button>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <p className="text-sm text-green-700">
                La contraseña debe tener mínimo 8 caracteres, con mayúscula,
                minúscula, número y carácter especial.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="text-green-600 hover:text-green-800 font-semibold text-sm"
              disabled={isLoading}
            >
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordReset;
