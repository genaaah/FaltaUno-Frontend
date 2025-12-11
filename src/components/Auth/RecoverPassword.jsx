import React, { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { sweetAlert } from "../../utils/sweetAlert";

function RecoverPassword({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Solicitar email, 2: Cambiar contraseña
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isOpen) {
      const queryParams = new URLSearchParams(window.location.search);
      const urlToken = queryParams.get("token");

      if (urlToken) {
        setToken(urlToken);
        setStep(2);
      } else {
        setStep(1);
      }

      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({ email: "", newPassword: "", confirmPassword: "" });
    }
  }, [isOpen]);

  const validateEmail = (email) => {
    if (!email) return "El email es requerido.";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? "" : "Ingresá un email válido.";
  };

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

  const handleRequestReset = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    setErrors({ ...errors, email: emailError });

    if (emailError) return;

    setIsLoading(true);

    try {
      await authService.requestPasswordReset(email);

      await sweetAlert.success(
        "Correo enviado",
        "Revisa tu bandeja de entrada para continuar."
      );

      setEmail("");
      onClose();
    } catch (error) {
      await sweetAlert.error(
        "Error",
        error.message || "No se pudo enviar el correo"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(newPassword);
    const confirmError = validateConfirm(confirmPassword, newPassword);

    setErrors({
      ...errors,
      newPassword: passwordError,
      confirmPassword: confirmError,
    });

    if (passwordError || confirmError) return;

    if (!token) {
      await sweetAlert.error("Error", "Token de recuperación no válido");
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, newPassword, confirmPassword);

      await sweetAlert.success(
        "¡Contraseña cambiada!",
        "Ahora puedes iniciar sesión con tu nueva contraseña."
      );

      setNewPassword("");
      setConfirmPassword("");
      setToken("");
      setStep(1);
      onClose();

      setTimeout(() => {
        window.location.href = "/auth";
      }, 1000);
    } catch (error) {
      await sweetAlert.error(
        "Error",
        error.message || "No se pudo cambiar la contraseña"
      );
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
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const isStep1Disabled = isLoading || !email || errors.email;
  const isStep2Disabled =
    isLoading ||
    !newPassword ||
    !confirmPassword ||
    errors.newPassword ||
    errors.confirmPassword;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-3 sm:mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-5 sm:p-6">
          <div className="flex justify-between items-center mb-5 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">
              {step === 1 ? "Recuperar Contraseña" : "Nueva Contraseña"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              disabled={isLoading}
              aria-label="Cerrar"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {step === 1 ? (
            <form
              onSubmit={handleRequestReset}
              className="space-y-5 sm:space-y-6"
            >
              <div>
                <p className="text-gray-600 text-sm sm:text-base mb-4">
                  Ingresá tu email para recibir un enlace de recuperación.
                </p>

                <div>
                  <label
                    htmlFor="recover-email"
                    className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                  >
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="recover-email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({
                        ...errors,
                        email: validateEmail(e.target.value),
                      });
                    }}
                    placeholder="ejemplo@mail.com"
                    className={`w-full px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                      errors.email ? "border-red-400" : "border-gray-300"
                    } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
                    disabled={isLoading}
                    required
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-red-500 text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="order-2 sm:order-1 flex-1 bg-gray-100 text-gray-800 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isStep1Disabled}
                  className="order-1 sm:order-2 flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-green-600 disabled:hover:to-emerald-600 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      <span className="text-sm sm:text-base">Enviando...</span>
                    </>
                  ) : (
                    <span className="text-sm sm:text-base">Enviar enlace</span>
                  )}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                    Te enviaremos un email con un enlace seguro para cambiar tu
                    contraseña. El enlace expira en 1 hora.
                  </p>
                </div>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleResetPassword}
              className="space-y-5 sm:space-y-6"
            >
              <div>
                <p className="text-gray-600 text-sm sm:text-base mb-4">
                  Creá una nueva contraseña para tu cuenta.
                </p>

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                    >
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      id="new-password"
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
                        errors.newPassword
                          ? "border-red-400"
                          : "border-gray-300"
                      } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
                      disabled={isLoading}
                      required
                      aria-describedby={
                        errors.newPassword ? "new-password-error" : undefined
                      }
                    />
                    {errors.newPassword && (
                      <p
                        id="new-password-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                    >
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
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
                        errors.confirmPassword
                          ? "border-red-400"
                          : "border-gray-300"
                      } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
                      disabled={isLoading}
                      required
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirm-password-error"
                          : undefined
                      }
                    />
                    {errors.confirmPassword && (
                      <p
                        id="confirm-password-error"
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setNewPassword("");
                    setConfirmPassword("");
                    setErrors({ newPassword: "", confirmPassword: "" });
                  }}
                  className="order-2 sm:order-1 flex-1 bg-gray-100 text-gray-800 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={isStep2Disabled}
                  className="order-1 sm:order-2 flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-green-600 disabled:hover:to-emerald-600 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      <span className="text-sm sm:text-base">Cambiando...</span>
                    </>
                  ) : (
                    <span className="text-sm sm:text-base">
                      Cambiar contraseña
                    </span>
                  )}
                </button>
              </div>
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
                  <div>
                    <p className="text-xs sm:text-sm text-green-700 font-medium mb-1.5">
                      Requisitos de contraseña:
                    </p>
                    <ul className="text-xs text-green-600 space-y-0.5 sm:space-y-1">
                      <li className="flex items-center gap-1">
                        <span className="text-green-500">•</span>
                        <span>Mínimo 8 caracteres</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="text-green-500">•</span>
                        <span>Al menos una mayúscula y una minúscula</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="text-green-500">•</span>
                        <span>Al menos un número</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="text-green-500">•</span>
                        <span>Al menos un carácter especial</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecoverPassword;
