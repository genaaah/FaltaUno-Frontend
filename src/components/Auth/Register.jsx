import React, { useState } from "react";

function Register({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    documento: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    email: "",
    documento: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateName = (name, field) => {
    if (!name)
      return `El ${field === "nombre" ? "nombre" : "apellido"} es requerido.`;
    return name.trim().length >= 2 ? "" : `Debe tener al menos 2 caracteres.`;
  };

  const validateEmail = (email) => {
    if (!email) return "El email es requerido.";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? "" : "Ingresá un email válido.";
  };

  const validateDocumento = (documento) => {
    if (!documento) return "El documento es requerido.";

    if (!/^\d+$/.test(documento)) {
      return "El documento solo puede contener números.";
    }

    const re = /^\d{8,10}$/;
    return re.test(documento)
      ? ""
      : "Debe tener entre 8 y 10 dígitos numéricos.";
  };

  const validatePassword = (password) => {
    if (!password) return "La contraseña es requerida.";
    if (password.length < 8)
      return "La contraseña debe tener mínimo 8 caracteres.";
    if (!/[A-Z]/.test(password))
      return "Debe tener al menos una letra mayúscula.";
    if (!/[a-z]/.test(password))
      return "Debe tener al menos una letra minúscula.";
    if (!/\d/.test(password)) return "Debe tener al menos un número.";
    if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password))
      return "Debe tener al menos un carácter especial.";
    return "";
  };

  const validateConfirm = (confirm, password) => {
    if (!confirm) return "Confirmá la contraseña.";
    return confirm === password ? "" : "Las contraseñas no coinciden.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const nombreError = validateName(formData.nombre, "nombre");
    const apellidoError = validateName(formData.apellido, "apellido");
    const emailError = validateEmail(formData.email);
    const documentoError = validateDocumento(formData.documento);
    const passwordError = validatePassword(formData.password);
    const confirmError = validateConfirm(
      formData.confirmPassword,
      formData.password
    );

    setErrors({
      nombre: nombreError,
      apellido: apellidoError,
      email: emailError,
      documento: documentoError,
      password: passwordError,
      confirmPassword: confirmError,
    });

    if (
      nombreError ||
      apellidoError ||
      emailError ||
      documentoError ||
      passwordError ||
      confirmError
    ) {
      setIsLoading(false);
      return;
    }

    const result = await onRegister({
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      documento: formData.documento,
      password: formData.password,
    });

    setIsLoading(false);

    if (!result.success) {
      alert(result.message || "Error en el registro");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "documento") {
      const numericValue = value.replace(/\D/g, "");
      const limitedValue = numericValue.slice(0, 10);

      setFormData((prev) => ({ ...prev, [name]: limitedValue }));
      setErrors((prev) => ({
        ...prev,
        [name]: validateDocumento(limitedValue),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "nombre") {
      setErrors((prev) => ({ ...prev, nombre: validateName(value, "nombre") }));
    }
    if (name === "apellido") {
      setErrors((prev) => ({
        ...prev,
        apellido: validateName(value, "apellido"),
      }));
    }
    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
        confirmPassword: validateConfirm(formData.confirmPassword, value),
      }));
    }
    if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirm(value, formData.password),
      }));
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

  const hasErrors = Boolean(
    errors.nombre ||
      errors.apellido ||
      errors.email ||
      errors.documento ||
      errors.password ||
      errors.confirmPassword
  );

  const isFormValid =
    formData.nombre &&
    formData.apellido &&
    formData.email &&
    formData.documento &&
    formData.password &&
    formData.confirmPassword;

  const isSubmitDisabled = isLoading || hasErrors || !isFormValid;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div>
          <label
            htmlFor="register-nombre"
            className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
          >
            Nombre
          </label>
          <input
            type="text"
            id="register-nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Juan"
            className={`w-full px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
              errors.nombre ? "border-red-400" : "border-gray-300"
            } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
            aria-invalid={errors.nombre ? "true" : "false"}
            aria-describedby={errors.nombre ? "nombre-error" : undefined}
            required
            disabled={isLoading}
          />
          {errors.nombre && (
            <p id="nombre-error" className="text-red-500 text-xs mt-1">
              {errors.nombre}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="register-apellido"
            className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
          >
            Apellido
          </label>
          <input
            type="text"
            id="register-apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Pérez"
            className={`w-full px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
              errors.apellido ? "border-red-400" : "border-gray-300"
            } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
            aria-invalid={errors.apellido ? "true" : "false"}
            aria-describedby={errors.apellido ? "apellido-error" : undefined}
            required
            disabled={isLoading}
          />
          {errors.apellido && (
            <p id="apellido-error" className="text-red-500 text-xs mt-1">
              {errors.apellido}
            </p>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="register-email"
          className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
        >
          Correo electrónico
        </label>
        <input
          type="email"
          id="register-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="juan@mail.com"
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
          htmlFor="register-documento"
          className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
        >
          Documento
        </label>
        <input
          type="text"
          id="register-documento"
          name="documento"
          value={formData.documento}
          onChange={handleChange}
          placeholder="12345678"
          inputMode="numeric"
          pattern="[0-9]*"
          className={`w-full px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
            errors.documento ? "border-red-400" : "border-gray-300"
          } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
          aria-invalid={errors.documento ? "true" : "false"}
          aria-describedby={errors.documento ? "documento-error" : undefined}
          required
          disabled={isLoading}
        />
        {errors.documento && (
          <p id="documento-error" className="text-red-500 text-xs mt-1">
            {errors.documento}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">8-10 dígitos numéricos</p>
      </div>
      <div>
        <label
          htmlFor="register-password"
          className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
        >
          Contraseña
        </label>
        <input
          type="password"
          id="register-password"
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
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Mínimo 8 caracteres, con mayúscula, minúscula, número y carácter
          especial
        </p>
      </div>
      <div>
        <label
          htmlFor="register-confirm"
          className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
        >
          Confirmar contraseña
        </label>
        <input
          type="password"
          id="register-confirm"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="********"
          className={`w-full px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
            errors.confirmPassword ? "border-red-400" : "border-gray-300"
          } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
          aria-invalid={errors.confirmPassword ? "true" : "false"}
          aria-describedby={
            errors.confirmPassword ? "confirm-error" : undefined
          }
          required
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p id="confirm-error" className="text-red-500 text-xs mt-1">
            {errors.confirmPassword}
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
            <span className="text-sm sm:text-base">Registrando...</span>
          </>
        ) : (
          <span className="text-sm sm:text-base">Registrarse</span>
        )}
      </button>
      <p className="text-center text-xs sm:text-sm text-gray-600 pt-2">
        ¿Ya tenés cuenta?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-green-600 hover:text-green-800 font-semibold transition-colors duration-200 ml-1"
          disabled={isLoading}
        >
          Iniciá sesión
        </button>
      </p>
    </form>
  );
}

export default Register;
