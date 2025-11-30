import React, { useState } from "react";
import RecoverPassword from "./RecoverPassword";

function Login({ onLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (email) => {
    if (!email) return "El email es requerido.";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? "" : "Ingresá un email válido.";
  };

  const validatePassword = (password) => {
    if (!password) return "La contraseña es requerida.";
    return password.length >= 6 ? "" : "La contraseña debe tener al menos 6 caracteres.";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    setErrors({ email: emailError, password: passwordError });
    if (emailError || passwordError) return;
    onLogin(formData.email, formData.password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    if (name === "email") setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    if (name === "password") setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };

  const [isRecoverOpen, setIsRecoverOpen] = useState(false);

  return (
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
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
          aria-invalid={errors.email ? "true" : "false"}
          required
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
          aria-invalid={errors.password ? "true" : "false"}
          required
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
        disabled={Boolean(errors.email || errors.password) || !formData.email || !formData.password}
      >
        Iniciar sesión
      </button>

      <p className="text-center text-sm text-gray-600">
        ¿No tienes cuenta?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-green-600 hover:text-green-800 font-semibold"
        >
          Registrate
        </button>
      </p>
      <p className="text-center text-sm mt-2">
        <button type="button" onClick={() => setIsRecoverOpen(true)} className="text-sm text-green-600 hover:text-green-800 underline">
          ¿Olvidaste tu contraseña?
        </button>
      </p>

      <RecoverPassword isOpen={isRecoverOpen} onClose={() => setIsRecoverOpen(false)} />
    </form>
  );
}

export default Login;
