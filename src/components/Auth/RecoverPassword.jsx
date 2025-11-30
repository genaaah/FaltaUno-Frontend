import React, { useState } from "react";

function RecoverPassword({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value) => {
    if (!value) return "El email es requerido.";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value) ? "" : "Ingresá un email válido.";
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError(validateEmail(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    if (err) return;

    // Simulate sending reset email
    console.log("Solicitar recuperación de contraseña para:", email);
    setSubmitted(true);

    setTimeout(() => {
      setEmail("");
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 z-10"
        >
          &times;
        </button>

        {submitted ? (
          <div className="text-center py-8 sm:py-12">
            <div className="mb-4 text-3xl sm:text-4xl text-green-600">✓</div>
            <h3 className="text-lg sm:text-xl font-bold text-green-600 mb-2">Correo enviado</h3>
            <p className="text-sm sm:text-base text-gray-600">Revisá tu bandeja de entrada para seguir los pasos para recuperar tu contraseña.</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-4 text-center">Recuperar contraseña</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="recover-email" className="block text-sm font-medium text-gray-700 mb-2">Email asociado</label>
                <input
                  id="recover-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${error ? 'border-red-400' : 'border-gray-300'}`}
                  aria-invalid={error ? "true" : "false"}
                  required
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>

              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors" disabled={Boolean(error) || !email}>
                Enviar instrucciones
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default RecoverPassword;
