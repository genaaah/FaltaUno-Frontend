import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { matchesService } from "../../services/matchesService";
import { fieldsService } from "../../services/fieldsService";
import { sweetAlert } from "../../utils/sweetAlert";

const LoadingSpinner = ({ size = "w-4 h-4" }) => (
  <svg
    className={`animate-spin ${size} text-white`}
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
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    ></path>
  </svg>
);

const FormField = ({ label, required, error, children, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const InfoBox = ({ type = "info", children }) => {
  const config = {
    info: "bg-blue-50 border-blue-200 text-blue-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    error: "bg-red-50 border-red-200 text-red-600",
    success: "bg-green-50 border-green-200 text-green-700",
  };

  return (
    <div className={`rounded-lg p-3 border ${config[type]} text-xs`}>
      {children}
    </div>
  );
};

const TeamInfoCard = ({ user }) => {
  const teamInitial = user?.equipo?.nombre?.charAt(0)?.toUpperCase() || "?";
  const teamName = user?.equipo?.nombre || "Tu equipo";

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {teamInitial}
        </div>
        <div>
          <p className="font-medium text-green-800 text-sm">{teamName}</p>
          <p className="text-xs text-green-600">Equipo local</p>
        </div>
      </div>
      <p className="text-xs text-green-700">
        Como creador, eres el equipo local y puedes gestionar el partido.
      </p>
    </div>
  );
};

const useTimeSlots = () => {
  return useMemo(() => {
    const slots = [];
    for (let i = 8; i <= 24; i++) {
      const hora = i > 12 ? i - 12 : i;
      const periodo = i < 12 ? "AM" : i === 24 ? "AM" : "PM";
      const horaFormato =
        i === 24 ? "00:00" : `${i.toString().padStart(2, "0")}:00`;
      const horaDisplay =
        i === 24
          ? "12:00 AM"
          : `${hora.toString().padStart(2, "0")}:00 ${periodo}`;

      slots.push({ valor: horaFormato, label: horaDisplay });
    }
    return slots;
  }, []);
};

const useFormValidation = () => {
  const validateDate = (dateStr, timeStr = null) => {
    if (!dateStr) return "La fecha es requerida";

    const selectedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) return "La fecha no puede ser en el pasado";

    if (timeStr) {
      const fechaHoraSeleccionada = new Date(`${dateStr}T${timeStr}`);
      const ahora = new Date();
      const unaHoraDespues = new Date(ahora.getTime() + 60 * 60 * 1000);

      if (fechaHoraSeleccionada <= ahora) {
        return "La fecha y hora deben ser futuras";
      }

      if (fechaHoraSeleccionada <= unaHoraDespues) {
        return "Debe haber al menos 1 hora de anticipación";
      }
    }

    return null;
  };

  const validateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;

    const fechaHoraSeleccionada = new Date(`${dateStr}T${timeStr}`);
    const ahora = new Date();

    if (fechaHoraSeleccionada <= ahora) {
      return "La hora debe ser futura";
    }

    return null;
  };

  return { validateDate, validateTime };
};

function CreateMatchForm({ onSuccess, onCancel }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState([]);

  const [formData, setFormData] = useState({
    fecha: "",
    hora: "08:00",
    canchaId: "",
  });

  const [errors, setErrors] = useState({});
  const timeSlots = useTimeSlots();
  const { validateDate, validateTime } = useFormValidation();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const fieldsData = await fieldsService.getAllFields();
        setFields(fieldsData);

        if (fieldsData.length > 0 && !formData.canchaId) {
          setFormData((prev) => ({ ...prev, canchaId: fieldsData[0].id }));
        }
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
        await sweetAlert.error(
          "Error",
          "No se pudieron cargar los datos necesarios"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "fecha":
        const dateError = validateDate(value, formData.hora);
        if (dateError) {
          newErrors.fecha = dateError;
        } else {
          delete newErrors.fecha;
          if (formData.hora) {
            const timeError = validateTime(value, formData.hora);
            if (timeError) {
              newErrors.hora = timeError;
            } else {
              delete newErrors.hora;
            }
          }
        }
        break;

      case "hora":
        const timeError = validateTime(formData.fecha, value);
        if (timeError) {
          newErrors.hora = timeError;
        } else {
          delete newErrors.hora;
          delete newErrors.fecha;
        }
        break;

      case "canchaId":
        if (!value) {
          newErrors.canchaId = "Selecciona una cancha";
        } else {
          delete newErrors.canchaId;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTimeout(() => validateField(name, value), 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fechaError = validateDate(formData.fecha, formData.hora);
    const horaError = validateTime(formData.fecha, formData.hora);
    const canchaError = !formData.canchaId ? "Selecciona una cancha" : null;

    const finalErrors = {};
    if (fechaError) finalErrors.fecha = fechaError;
    if (horaError) finalErrors.hora = horaError;
    if (canchaError) finalErrors.canchaId = canchaError;

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      await sweetAlert.warning(
        "Formulario incompleto",
        "Por favor corrige los errores en el formulario"
      );
      return;
    }

    const fechaCompleta = new Date(`${formData.fecha}T${formData.hora}`);
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

    if (!confirmResult.isConfirmed) return;

    setIsLoading(true);
    try {
      const matchToCreate = {
        hora_dia: fechaCompleta.toISOString(),
        partido: {
          canchaId: parseInt(formData.canchaId),
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
        canchaId: fields.length > 0 ? fields[0].id : "",
      });
      setErrors({});

      if (onSuccess) onSuccess(result);
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

  const isFormValid =
    !Object.keys(errors).length &&
    formData.fecha &&
    formData.hora &&
    formData.canchaId;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-md mx-auto">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
          Crear Nuevo Partido
        </h3>
        <p className="text-gray-600 text-sm mt-1 sm:mt-2">
          Programa un partido para tu equipo. Puedes elegir un contrincante o
          dejarlo abierto.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <FormField label="Fecha" required error={errors.fecha}>
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
          </FormField>

          <FormField label="Hora" required error={errors.hora}>
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
              {timeSlots.map((slot) => (
                <option key={slot.valor} value={slot.valor}>
                  {slot.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        {(errors.fecha || errors.hora) && (
          <InfoBox type="error">
            💡 La fecha y hora seleccionadas deben ser futuras. Si seleccionaste
            hoy, asegúrate de elegir una hora posterior a la actual con al menos
            1 hora de anticipación.
          </InfoBox>
        )}
        <FormField label="Cancha" required error={errors.canchaId}>
          <select
            name="canchaId"
            value={formData.canchaId}
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
          {fields.length === 0 && !isLoading && (
            <p className="text-yellow-600 text-xs mt-1">
              No hay canchas disponibles
            </p>
          )}
        </FormField>
        <TeamInfoCard user={user} />
        <InfoBox
          type={
            isFormValid
              ? "success"
              : Object.keys(errors).length
              ? "warning"
              : "info"
          }
        >
          {Object.keys(errors).length > 0
            ? `⚠️ Hay ${
                Object.keys(errors).length
              } error(es) que corregir antes de crear el partido.`
            : isFormValid
            ? `✅ Formulario completo. Partido programado para el ${new Date(
                `${formData.fecha}T${formData.hora}`
              ).toLocaleDateString()} a las ${formData.hora}`
            : "Completa todos los campos requeridos para crear el partido."}
        </InfoBox>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 sm:py-2 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="flex-1 bg-green-600 text-white py-2.5 sm:py-2 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-h-[44px]"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="w-4 h-4" />
                <span className="ml-2">Creando...</span>
              </>
            ) : (
              "Crear Partido"
            )}
          </button>
        </div>
      </form>
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 text-sm mb-2 sm:mb-3 flex items-center gap-1">
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
        <ul className="text-xs text-gray-600 space-y-1 sm:space-y-0.5">
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
