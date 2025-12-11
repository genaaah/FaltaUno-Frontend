import React, { useState } from "react";

function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    consulta: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({ nombre: "", email: "" });

  const validateName = (name) => {
    if (!name || name.trim().length < 2)
      return "El nombre debe tener al menos 2 caracteres.";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "El email es requerido.";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Ingresá un email válido.";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "nombre") {
      setErrors((prev) => ({ ...prev, nombre: validateName(value) }));
    }
    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nombreError = validateName(formData.nombre);
    const emailError = validateEmail(formData.email);
    setErrors({ nombre: nombreError, email: emailError });

    if (nombreError || emailError || !formData.consulta) {
      alert(
        "Por favor, completá correctamente los campos obligatorios (Nombre, Email, Consulta)"
      );
      return;
    }

    console.log("Formulario de contacto enviado:", formData);

    setSubmitted(true);

    setTimeout(() => {
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        consulta: "",
      });
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 z-10"
        >
          &times;
        </button>

        {submitted ? (
          <div className="text-center py-8 sm:py-12">
            <div className="mb-4 text-3xl sm:text-4xl text-green-600">✓</div>
            <h3 className="text-lg sm:text-xl font-bold text-green-600 mb-2">
              ¡Mensaje enviado!
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Nos contactaremos pronto. Gracias por tu consulta.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-6 text-center">
              Contacto
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                >
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  aria-invalid={errors.nombre ? "true" : "false"}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm border ${
                    errors.nombre ? "border-red-400" : "border-gray-300"
                  }`}
                  required
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm border ${
                    errors.email ? "border-red-400" : "border-gray-300"
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                >
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+54 9 XX XXXX-XXXX"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="consulta"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                >
                  Consulta *
                </label>
                <textarea
                  id="consulta"
                  name="consulta"
                  value={formData.consulta}
                  onChange={handleChange}
                  placeholder="Cuéntanos tu consulta..."
                  rows="4"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                Enviar Consulta
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ContactModal;
