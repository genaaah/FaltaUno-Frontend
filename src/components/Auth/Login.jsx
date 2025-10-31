import React, { useState } from "react";

function Login({ onLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.email, formData.password);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
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
    </form>
  );
}

export default Login;
