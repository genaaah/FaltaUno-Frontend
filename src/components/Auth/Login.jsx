import React, { useState } from "react";
import RecoverPassword from "./RecoverPassword";
import { sweetAlert } from "../../utils/sweetAlert";

function Login({ onLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showResendLink, setShowResendLink] = useState(false);
  const [isRecoverOpen, setIsRecoverOpen] = useState(false);

  const validateEmail = (email) => {
    if (!email) return "El email es requerido.";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? "" : "Ingresá un email válido.";
  };

  const validatePassword = (password) => {
    if (!password) return "La contraseña es requerida.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowResendLink(false);

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      setIsLoading(false);
      return;
    }

    const result = await onLogin(formData.email, formData.password);
    setIsLoading(false);

    if (!result.success) {
      if (result.message?.includes("verificar tu cuenta")) {
        setShowResendLink(true);
        await sweetAlert.warning(
          "Cuenta no verificada",
          "Debes verificar tu cuenta antes de iniciar sesión. Revisa tu correo electrónico."
        );
      } else {
        await sweetAlert.error(
          "Error en el inicio de sesión",
          result.message || "Credenciales incorrectas"
        );
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email")
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    if (name === "password")
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };

  const handleResendVerification = async () => {
    const result = await sweetAlert.confirm(
      "Reenviar correo de verificación",
      "¿Deseas que reenviemos el correo de verificación a tu email?",
      "Sí, reenviar",
      "Cancelar"
    );

    if (result.isConfirmed) {
      await sweetAlert.success(
        "Solicitud enviada",
        "Si el email está registrado y no verificado, recibirás un nuevo correo de verificación en los próximos minutos."
      );
    }
  };

  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-white"
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

  const isSubmitDisabled =
    isLoading ||
    Boolean(errors.email || errors.password) ||
    !formData.email ||
    !formData.password;

  return (
    <div className="space-y-6 sm:space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="login-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@mail.com"
            className={`w-full px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
              errors.email ? "border-red-400" : "border-gray-300"
            } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            required
            disabled={isLoading}
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-xs mt-1">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="login-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            className={`w-full px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
              errors.password ? "border-red-400" : "border-gray-300"
            } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
            required
            disabled={isLoading}
          />
          {errors.password && (
            <p id="password-error" className="text-red-500 text-xs mt-1">
              {errors.password}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-green-600 disabled:hover:to-emerald-600 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
          disabled={isSubmitDisabled}
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="text-sm sm:text-base">Iniciando sesión...</span>
            </>
          ) : (
            <span className="text-sm sm:text-base">Iniciar sesión</span>
          )}
        </button>
        {showResendLink && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 animate-fade-in">
            <p className="text-yellow-800 text-xs sm:text-sm mb-1.5 sm:mb-2 font-medium">
              Cuenta no verificada
            </p>
            <button
              type="button"
              onClick={handleResendVerification}
              className="text-xs sm:text-sm text-green-600 hover:text-green-800 underline font-medium transition-colors duration-200"
              disabled={isLoading}
            >
              ¿No recibiste el correo de verificación?
            </button>
          </div>
        )}
      </form>
      <div className="space-y-3 sm:space-y-4 pt-2 border-t border-gray-100">
        <p className="text-center text-xs sm:text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-green-600 hover:text-green-800 font-semibold transition-colors duration-200 ml-1"
            disabled={isLoading}
          >
            Registrate
          </button>
        </p>
        <p className="text-center">
          <button
            type="button"
            onClick={() => setIsRecoverOpen(true)}
            className="text-xs sm:text-sm text-green-600 hover:text-green-800 underline transition-colors duration-200"
            disabled={isLoading}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </p>
      </div>
      <RecoverPassword
        isOpen={isRecoverOpen}
        onClose={() => setIsRecoverOpen(false)}
      />
    </div>
  );
}

export default Login;
