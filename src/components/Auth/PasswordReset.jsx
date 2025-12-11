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

  const LoadingSpinner = ({ size = "w-5 h-5", color = "text-white" }) => (
    <svg
      className={`animate-spin ${size} ${color}`}
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
  );

  const stepConfig = {
    loading: {
      icon: <LoadingSpinner size="w-8 h-8" color="text-blue-600" />,
      title: "Verificando enlace...",
      description: "Por favor espera.",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    error: {
      icon: (
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
      ),
      title: "Enlace inválido",
      description: "El enlace de recuperación no es válido o ha expirado.",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
    },
  };

  if (step === "loading" || step === "error") {
    const config = stepConfig[step];
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-auto text-center">
          <div className="mb-6">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center ${config.bgColor} ${config.textColor}`}
            >
              {config.icon}
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            {config.title}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">
            {config.description}
          </p>
          {step === "error" && (
            <button
              onClick={() => navigate("/auth")}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Ir al inicio de sesión
            </button>
          )}
        </div>
      </div>
    );
  }

  const isSubmitDisabled =
    isLoading ||
    !newPassword ||
    !confirmPassword ||
    errors.newPassword ||
    errors.confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-auto">
        <div className="mb-6 sm:mb-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10"
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Nueva Contraseña
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Creá una nueva contraseña para tu cuenta.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label
                htmlFor="reset-new-password"
                className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
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
                className={`w-full px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                  errors.newPassword ? "border-red-400" : "border-gray-300"
                } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
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
                className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
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
                className={`w-full px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                  errors.confirmPassword ? "border-red-400" : "border-gray-300"
                } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
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
            disabled={isSubmitDisabled}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-green-600 disabled:hover:to-emerald-600 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span className="text-sm sm:text-base">Cambiando...</span>
              </>
            ) : (
              <span className="text-sm sm:text-base">Cambiar contraseña</span>
            )}
          </button>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0"
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
              <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
                La contraseña debe tener mínimo 8 caracteres, con mayúscula,
                minúscula, número y carácter especial.
              </p>
            </div>
          </div>
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="text-green-600 hover:text-green-800 font-semibold text-xs sm:text-sm transition-colors duration-200"
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
