import React, { useState } from "react";

function Register({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    email: "",
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
    const passwordError = validatePassword(formData.password);
    const confirmError = validateConfirm(
      formData.confirmPassword,
      formData.password
    );

    setErrors({
      nombre: nombreError,
      apellido: apellidoError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmError,
    });

    if (
      nombreError ||
      apellidoError ||
      emailError ||
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
      password: formData.password,
    });

    setIsLoading(false);

    if (!result.success) {
      alert(result.message || "Error en el registro");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "nombre")
      setErrors((prev) => ({ ...prev, nombre: validateName(value, "nombre") }));
    if (name === "apellido")
      setErrors((prev) => ({
        ...prev,
        apellido: validateName(value, "apellido"),
      }));
    if (name === "email")
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
        confirmPassword: validateConfirm(formData.confirmPassword, value),
      }));
    }
    if (name === "confirmPassword")
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirm(value, formData.password),
      }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="register-nombre"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.nombre ? "border-red-400" : "border-gray-300"
            }`}
            aria-invalid={errors.nombre ? "true" : "false"}
            required
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="register-apellido"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.apellido ? "border-red-400" : "border-gray-300"
            }`}
            aria-invalid={errors.apellido ? "true" : "false"}
            required
          />
          {errors.apellido && (
            <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="register-email"
          className="block text-sm font-medium text-gray-700 mb-2"
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
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.email ? "border-red-400" : "border-gray-300"
          }`}
          aria-invalid={errors.email ? "true" : "false"}
          required
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="register-password"
          className="block text-sm font-medium text-gray-700 mb-2"
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
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.password ? "border-red-400" : "border-gray-300"
          }`}
          aria-invalid={errors.password ? "true" : "false"}
          required
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Mínimo 8 caracteres, con mayúscula, minúscula, número y carácter
          especial
        </p>
      </div>

      <div>
        <label
          htmlFor="register-confirm"
          className="block text-sm font-medium text-gray-700 mb-2"
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
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.confirmPassword ? "border-red-400" : "border-gray-300"
          }`}
          aria-invalid={errors.confirmPassword ? "true" : "false"}
          required
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        disabled={
          isLoading ||
          Boolean(
            errors.nombre ||
              errors.apellido ||
              errors.email ||
              errors.password ||
              errors.confirmPassword
          ) ||
          !formData.nombre ||
          !formData.apellido ||
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword
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
            Registrando...
          </>
        ) : (
          "Registrarse"
        )}
      </button>

      <p className="text-center text-sm text-gray-600">
        ¿Ya tenés cuenta?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-green-600 hover:text-green-800 font-semibold"
        >
          Iniciá sesión
        </button>
      </p>
    </form>
  );
}

export default Register;
