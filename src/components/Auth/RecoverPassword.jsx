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

  // Extraer token de URL si existe (cuando viene del email)
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
      
      // Limpiar formulario
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
      const result = await authService.requestPasswordReset(email);
      
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
      const result = await authService.resetPassword(
        token,
        newPassword,
        confirmPassword
      );
      
      await sweetAlert.success(
        "¡Contraseña cambiada!",
        "Ahora puedes iniciar sesión con tu nueva contraseña."
      );
      
      // Limpiar y cerrar
      setNewPassword("");
      setConfirmPassword("");
      setToken("");
      setStep(1);
      onClose();
      
      // Redirigir a login
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {step === 1 ? "Recuperar Contraseña" : "Nueva Contraseña"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <svg
                className="w-6 h-6"
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
            <form onSubmit={handleRequestReset} className="space-y-6">
              <div>
                <p className="text-gray-600 mb-4">
                  Ingresá tu email para recibir un enlace de recuperación.
                </p>
                
                <div>
                  <label
                    htmlFor="recover-email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="recover-email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({ ...errors, email: validateEmail(e.target.value) });
                    }}
                    placeholder="ejemplo@mail.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.email ? "border-red-400" : "border-gray-300"
                    }`}
                    disabled={isLoading}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !email || errors.email}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
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
                      Enviando...
                    </>
                  ) : (
                    "Enviar enlace"
                  )}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
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
                  <p className="text-sm text-blue-700">
                    Te enviaremos un email con un enlace seguro para cambiar tu contraseña.
                    El enlace expira en 1 hora.
                  </p>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <p className="text-gray-600 mb-4">
                  Creá una nueva contraseña para tu cuenta.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-gray-700 mb-2"
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
                          confirmPassword: validateConfirm(confirmPassword, e.target.value),
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
                      <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-700 mb-2"
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
                          confirmPassword: validateConfirm(e.target.value, newPassword),
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
                      <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setNewPassword("");
                    setConfirmPassword("");
                    setErrors({ newPassword: "", confirmPassword: "" });
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !newPassword ||
                    !confirmPassword ||
                    errors.newPassword ||
                    errors.confirmPassword
                  }
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
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
              </div>

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
                  <div>
                    <p className="text-sm text-green-700 font-medium mb-1">
                      Requisitos de contraseña:
                    </p>
                    <ul className="text-xs text-green-600 space-y-1">
                      <li>• Mínimo 8 caracteres</li>
                      <li>• Al menos una mayúscula y una minúscula</li>
                      <li>• Al menos un número</li>
                      <li>• Al menos un carácter especial</li>
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