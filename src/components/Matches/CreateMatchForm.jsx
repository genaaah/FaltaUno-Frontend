import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { matchesService } from "../../services/matchesService";
import { fieldsService } from "../../services/fieldsService";
import { sweetAlert } from "../../utils/sweetAlert";

function CreateMatchForm({ onSuccess, onCancel }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState([]);

  const [formData, setFormData] = useState({
    fecha: "",
    hora: "08:00",
    partido: {
      canchaId: "",
      contrincante: "",
    },
  });

  const [errors, setErrors] = useState({});

  const generarHorarios = () => {
    const horarios = [];
    for (let i = 8; i <= 24; i++) {
      const hora = i > 12 ? i - 12 : i;
      const periodo = i < 12 ? "AM" : i === 24 ? "AM" : "PM";
      const horaFormato =
        i === 24 ? "00:00" : `${i.toString().padStart(2, "0")}:00`;
      const horaDisplay =
        i === 24
          ? "12:00 AM"
          : `${hora.toString().padStart(2, "0")}:00 ${periodo}`;
      horarios.push({
        valor: horaFormato,
        label: horaDisplay,
      });
    }
    return horarios;
  };

  const horarios = generarHorarios();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const fieldsData = await fieldsService.getAllFields();
      setFields(fieldsData);

      if (fieldsData.length > 0 && !formData.partido.canchaId) {
        setFormData((prev) => ({
          ...prev,
          partido: {
            ...prev.partido,
            canchaId: fieldsData[0].id,
          },
        }));
      }
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
      sweetAlert.error("Error", "No se pudieron cargar los datos necesarios");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fecha.trim()) {
      newErrors.fecha = "La fecha es requerida";
    } else {
      const selectedDate = new Date(formData.fecha);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.fecha = "La fecha no puede ser en el pasado";
      }
    }

    if (formData.fecha && formData.hora) {
      const fechaHoraSeleccionada = new Date(
        `${formData.fecha}T${formData.hora}`
      );
      const ahora = new Date();

      if (fechaHoraSeleccionada <= ahora) {
        newErrors.fecha = "La fecha y hora deben ser futuras";
        newErrors.hora = "La hora debe ser futura";
      }

      const unaHoraDespues = new Date(ahora.getTime() + 60 * 60 * 1000);
      if (fechaHoraSeleccionada <= unaHoraDespues) {
        newErrors.fecha = "Debe haber al menos 1 hora de anticipación";
      }
    }

    if (!formData.partido.canchaId) {
      newErrors.canchaId = "Selecciona una cancha";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === "fecha") {
      if (!value.trim()) {
        newErrors.fecha = "La fecha es requerida";
      } else {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          newErrors.fecha = "La fecha no puede ser en el pasado";
        } else {
          delete newErrors.fecha;

          if (formData.hora) {
            const fechaHoraSeleccionada = new Date(`${value}T${formData.hora}`);
            const ahora = new Date();

            if (fechaHoraSeleccionada <= ahora) {
              newErrors.fecha = "La fecha y hora deben ser futuras";
              newErrors.hora = "La hora debe ser futura";
            } else {
              delete newErrors.hora;
            }
          }
        }
      }
    }

    if (name === "hora" && formData.fecha) {
      const fechaHoraSeleccionada = new Date(`${formData.fecha}T${value}`);
      const ahora = new Date();

      if (fechaHoraSeleccionada <= ahora) {
        newErrors.hora = "La hora debe ser futura";
        newErrors.fecha = "La fecha y hora deben ser futuras";
      } else {
        delete newErrors.hora;
        delete newErrors.fecha;
      }
    }

    if (name === "canchaId") {
      if (!value) {
        newErrors.canchaId = "Selecciona una cancha";
      } else {
        delete newErrors.canchaId;
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fecha" || name === "hora") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setTimeout(() => validateField(name, value), 100);
    } else if (name === "canchaId") {
      setFormData((prev) => ({
        ...prev,
        partido: { ...prev.partido, canchaId: value },
      }));
      validateField(name, value);
    } else if (name === "contrincante") {
      setFormData((prev) => ({
        ...prev,
        partido: { ...prev.partido, contrincante: value },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      sweetAlert.warning(
        "Formulario incompleto",
        "Por favor corrige los errores en el formulario"
      );
      return;
    }

    const fechaCompleta = new Date(`${formData.fecha}T${formData.hora}`);

    const ahora = new Date();
    if (fechaCompleta <= ahora) {
      sweetAlert.warning(
        "Fecha inválida",
        "La fecha y hora deben ser futuras. Por favor selecciona una nueva hora."
      );
      return;
    }

    const confirmResult = await sweetAlert.confirm(
      "¿Crear partido?",
      `¿Deseas crear un partido para el ${fechaCompleta.toLocaleDateString(
        "es-ES",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )} a las ${formData.hora}?`,
      "Sí, crear",
      "Cancelar"
    );

    if (!confirmResult.isConfirmed) {
      return;
    }

    setIsLoading(true);

    try {
      const matchToCreate = {
        hora_dia: fechaCompleta.toISOString(),
        partido: {
          canchaId: parseInt(formData.partido.canchaId),
          contrincante: formData.partido.contrincante
            ? parseInt(formData.partido.contrincante)
            : undefined,
        },
      };

      const result = await matchesService.createMatch(matchToCreate);

      await sweetAlert.success(
        "¡Partido creado!",
        `Partido programado exitosamente para ${fechaCompleta.toLocaleDateString()} a las ${
          formData.hora
        }`
      );

      setFormData({
        fecha: "",
        hora: "08:00",
        partido: {
          canchaId: fields.length > 0 ? fields[0].id : "",
          contrincante: "",
        },
      });

      setErrors({});

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      await sweetAlert.error(
        "Error al crear partido",
        error.message ||
          "No se pudo crear el partido. Verifica los datos e intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const isFechaValida = () => {
    if (!formData.fecha) return true;
    const selectedDate = new Date(formData.fecha);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Crear Nuevo Partido</h3>
        <p className="text-gray-600 text-sm mt-1">
          Programa un partido para tu equipo. Puedes elegir un contrincante o
          dejarlo abierto.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fecha y Hora */}
        <div className="grid grid-cols-2 gap-3">
          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              min={getMinDate()}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.fecha ? "border-red-400" : "border-gray-300"
              }`}
              disabled={isLoading}
              required
            />
            {errors.fecha && (
              <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>
            )}
          </div>

          {/* Hora */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora <span className="text-red-500">*</span>
            </label>
            <select
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.hora ? "border-red-400" : "border-gray-300"
              }`}
              disabled={isLoading || !formData.fecha}
              required
            >
              {horarios.map((horario) => (
                <option key={horario.valor} value={horario.valor}>
                  {horario.label}
                </option>
              ))}
            </select>
            {errors.hora && (
              <p className="text-red-500 text-xs mt-1">{errors.hora}</p>
            )}
          </div>
        </div>

        {/* Mensaje de validación combinada */}
        {(errors.fecha || errors.hora) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2">
            <p className="text-red-600 text-xs">
              💡 La fecha y hora seleccionadas deben ser futuras. Si
              seleccionaste hoy, asegúrate de elegir una hora posterior a la
              actual.
            </p>
          </div>
        )}

        {/* Cancha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cancha <span className="text-red-500">*</span>
          </label>
          <select
            name="canchaId"
            value={formData.partido.canchaId}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.canchaId ? "border-red-400" : "border-gray-300"
            }`}
            disabled={isLoading || fields.length === 0}
            required
          >
            <option value="">Seleccionar cancha...</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.nombre}
              </option>
            ))}
          </select>
          {errors.canchaId && (
            <p className="text-red-500 text-xs mt-1">{errors.canchaId}</p>
          )}
          {fields.length === 0 && !isLoading && (
            <p className="text-yellow-600 text-xs mt-1">
              No hay canchas disponibles
            </p>
          )}
        </div>

        {/* Contrincante (opcional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contrincante (Opcional)
          </label>
          <select
            name="contrincante"
            value={formData.partido.contrincante}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="">Dejar abierto</option>
            {/* Aquí puedes agregar más opciones si tienes equipos disponibles */}
          </select>
          <p className="text-gray-500 text-xs mt-1">
            Si dejas vacío, otros equipos podrán unirse
          </p>
        </div>

        {/* Información del equipo */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.equipo?.nombre?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-medium text-green-800 text-sm">
                {user?.equipo?.nombre || "Tu equipo"}
              </p>
              <p className="text-xs text-green-600">Equipo local</p>
            </div>
          </div>
          <p className="text-xs text-green-700">
            Como creador, eres el equipo local y puedes gestionar el partido.
          </p>
        </div>

        {/* Estado del formulario */}
        <div
          className={`rounded-lg p-3 ${
            Object.keys(errors).length > 0
              ? "bg-yellow-50 border border-yellow-200"
              : "bg-blue-50 border border-blue-200"
          }`}
        >
          <p className="text-xs">
            {Object.keys(errors).length > 0 ? (
              <span className="text-yellow-700">
                ⚠️ Hay {Object.keys(errors).length} error(es) que corregir antes
                de crear el partido.
              </span>
            ) : formData.fecha && formData.hora && formData.partido.canchaId ? (
              <span className="text-blue-700">
                ✅ Formulario completo. Partido programado para el{" "}
                {new Date(
                  `${formData.fecha}T${formData.hora}`
                ).toLocaleDateString()}{" "}
                a las {formData.hora}
              </span>
            ) : (
              <span className="text-gray-600">
                Completa todos los campos requeridos para crear el partido.
              </span>
            )}
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={
              isLoading ||
              !formData.fecha ||
              !formData.hora ||
              !formData.partido.canchaId ||
              Object.keys(errors).length > 0
            }
            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-h-[40px]"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Creando...
              </>
            ) : (
              "Crear Partido"
            )}
          </button>
        </div>
      </form>

      {/* Información importante */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 text-sm mb-1 flex items-center gap-1">
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Información importante
        </h4>
        <ul className="text-xs text-gray-600 space-y-0.5">
          <li>• Solo el capitán puede crear partidos</li>
          <li>• Un partido sin contrincante está "abierto"</li>
          <li>• Otros capitanes pueden unirse a partidos abiertos</li>
          <li>• Los partidos se pueden cancelar hasta 24 horas antes</li>
          <li>• La fecha y hora deben ser futuras</li>
        </ul>
      </div>
    </div>
  );
}

export default CreateMatchForm;
