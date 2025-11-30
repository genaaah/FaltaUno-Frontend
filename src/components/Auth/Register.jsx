import React, { useState } from "react";

function Register({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const validateName = (name) => {
    if (!name) return "El nombre es requerido.";
    return name.trim().length >= 2 ? "" : "El nombre debe tener al menos 2 caracteres.";
  };

  const validateEmail = (email) => {
    if (!email) return "El email es requerido.";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? "" : "Ingresá un email válido.";
  };

  const validatePassword = (password) => {
    if (!password) return "La contraseña es requerida.";
    return password.length >= 6 ? "" : "La contraseña debe tener al menos 6 caracteres.";
  };

  const validateConfirm = (confirm, password) => {
    if (!confirm) return "Confirmá la contraseña.";
    return confirm === password ? "" : "Las contraseñas no coinciden.";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmError = validateConfirm(formData.confirmPassword, formData.password);
    setErrors({ name: nameError, email: emailError, password: passwordError, confirmPassword: confirmError });
    if (nameError || emailError || passwordError || confirmError) return;
    onRegister(formData.name, formData.email, formData.password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    if (name === "name") setErrors((prev) => ({ ...prev, name: validateName(value) }));
    if (name === "email") setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    if (name === "password") {
      setErrors((prev) => ({ ...prev, password: validatePassword(value), confirmPassword: validateConfirm(formData.confirmPassword, value) }));
    }
    if (name === "confirmPassword") setErrors((prev) => ({ ...prev, confirmPassword: validateConfirm(value, formData.password) }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="register-name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Nombre
        </label>
        <input
          type="text"
          id="register-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tu nombre"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
          aria-invalid={errors.name ? "true" : "false"}
          required
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
          placeholder="ejemplo@mail.com"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
          aria-invalid={errors.email ? "true" : "false"}
          required
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
          aria-invalid={errors.password ? "true" : "false"}
          required
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-400' : 'border-gray-300'}`}
          aria-invalid={errors.confirmPassword ? "true" : "false"}
          required
        />
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
        disabled={Boolean(errors.name || errors.email || errors.password || errors.confirmPassword) || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
      >
        Registrarse
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
