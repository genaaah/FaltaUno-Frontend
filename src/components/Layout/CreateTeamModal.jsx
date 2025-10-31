import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_SHIELDS = [
  "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
  "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
  "https://upload.wikimedia.org/wikipedia/commons/5/5d/Emblema_Benfica_1930_%28Sem_fundo%29.png",
  "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
  "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Escudo_del_Club_Atl%C3%A9tico_Independiente.svg/1200px-Escudo_del_Club_Atl%C3%A9tico_Independiente.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Emblema_oficial_del_Club_Atl%C3%A9tico_Hurac%C3%A1n.svg/631px-Emblema_oficial_del_Club_Atl%C3%A9tico_Hurac%C3%A1n.svg.png",
  "https://via.placeholder.com/150/007e33/ffffff?text=MI+EQUIPO",
];

function CreateTeamModal({
  isOpen,
  onClose,
  currentTeamName,
  currentTeamShield,
}) {
  const { user, updateUserTeam } = useAuth();
  const [teamName, setTeamName] = useState(currentTeamName || "");
  const [selectedShield, setSelectedShield] = useState(
    currentTeamShield || DEFAULT_SHIELDS[0]
  );
  const [customShieldUrl, setCustomShieldUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      alert("Por favor, ingresá un nombre para tu equipo.");
      return;
    }

    const finalShield = customShieldUrl.trim() || selectedShield;

    updateUserTeam(teamName.trim(), finalShield);
    onClose();

    setTeamName("");
    setSelectedShield(DEFAULT_SHIELDS[0]);
    setCustomShieldUrl("");
  };

  const handleShieldSelect = (shieldUrl) => {
    setSelectedShield(shieldUrl);
    setCustomShieldUrl("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
          {currentTeamName && currentTeamName !== "Sin equipo"
            ? "Editar Equipo"
            : "Crear Equipo"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="teamName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre del Equipo
            </label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Ej: Los Campeones FC"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Seleccionar Escudo Predeterminado
            </label>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {DEFAULT_SHIELDS.map((shield, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleShieldSelect(shield)}
                  className={`p-2 border-2 rounded-lg transition-all ${
                    selectedShield === shield && !customShieldUrl
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-green-300"
                  }`}
                >
                  <img
                    src={shield}
                    alt={`Escudo ${index + 1}`}
                    className="w-12 h-12 object-contain mx-auto"
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              htmlFor="customShield"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              O ingresar URL de escudo personalizado
            </label>
            <input
              type="url"
              id="customShield"
              value={customShieldUrl}
              onChange={(e) => {
                setCustomShieldUrl(e.target.value);
                if (e.target.value.trim()) {
                  setSelectedShield(e.target.value);
                }
              }}
              placeholder="https://ejemplo.com/escudo.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          {selectedShield && (
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={selectedShield}
                  alt="Vista previa escudo"
                  className="w-16 h-16 object-contain"
                />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">
                    {teamName || "Nombre del equipo"}
                  </p>
                  <p className="text-sm text-gray-600">Tu equipo se verá así</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              {currentTeamName && currentTeamName !== "Sin equipo"
                ? "Actualizar"
                : "Crear"}{" "}
              Equipo
            </button>
          </div>
        </form>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            💡 <strong>Consejo:</strong> Podés usar escudos de equipos
            existentes o subir el tuyo propio usando una URL de imagen.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateTeamModal;
