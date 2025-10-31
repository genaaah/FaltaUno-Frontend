import React, { useState } from "react";

function Register({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData.name, formData.email, formData.password);
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
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
