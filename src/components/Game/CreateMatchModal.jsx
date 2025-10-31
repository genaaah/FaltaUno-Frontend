import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function CreateMatchModal({ isOpen, onClose, onCreate }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    cancha: "",
    fecha: "",
    hora: "",
  });

  const canchas = [
    "cancha 1",
    "cancha 2",
    "cancha 3",
    "cancha 4",
    "cancha 5",
    "cancha 6",
  ];
  const horarios = ["16", "17", "18", "19", "20", "21", "22"];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.cancha || !formData.fecha || !formData.hora) {
      alert("Por favor, completá todos los campos para crear el partido.");
      return;
    }

    const newMatch = {
      id: Date.now(),
      idEquipoLocal: user.id,
      idEquipoVisitante: null,
      cancha: formData.cancha,
      fecha: formData.fecha,
      hora: formData.hora,
      creadoPor: user.email,
      estado: "pendiente",
    };

    onCreate(newMatch);
    setFormData({ cancha: "", fecha: "", hora: "" });
    onClose();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
          CREAR PARTIDO
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={user?.team_name}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
          />

          <select
            name="cancha"
            value={formData.cancha}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Elegí una cancha</option>
            {canchas.map((cancha) => (
              <option key={cancha} value={cancha}>
                {cancha}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />

          <select
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Elegí un horario</option>
            {horarios.map((horario) => (
              <option key={horario} value={horario}>
                {horario} HS
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
          >
            Crear
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateMatchModal;
