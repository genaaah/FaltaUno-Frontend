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

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.email ? "border-red-400" : "border-gray-300"
            }`}
            aria-invalid={errors.email ? "true" : "false"}
            required
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.password ? "border-red-400" : "border-gray-300"
            }`}
            aria-invalid={errors.password ? "true" : "false"}
            required
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={
            isLoading ||
            Boolean(errors.email || errors.password) ||
            !formData.email ||
            !formData.password
          }
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
              Iniciando sesión...
            </>
          ) : (
            "Iniciar sesión"
          )}
        </button>

        {showResendLink && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm mb-2">
              <strong>Cuenta no verificada</strong>
            </p>
            <button
              type="button"
              onClick={handleResendVerification}
              className="text-sm text-green-600 hover:text-green-800 underline font-medium"
            >
              ¿No recibiste el correo de verificación?
            </button>
          </div>
        )}
      </form>

      <div className="space-y-3">
        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-green-600 hover:text-green-800 font-semibold"
            disabled={isLoading}
          >
            Registrate
          </button>
        </p>
        <p className="text-center">
          <button
            type="button"
            onClick={() => setIsRecoverOpen(true)}
            className="text-sm text-green-600 hover:text-green-800 underline"
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
