import React, { useState } from "react";

function Calendar({ onDateSelect = null, selectedDate = null, compact = false }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"];

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleSelectDate = (day) => {
    if (day && onDateSelect) {
      // Crear la fecha ajustando por la zona horaria local
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");
      const formattedDate = `${year}-${month}-${dayStr}`;
      onDateSelect(formattedDate);
    }
  };

  const isDateSelected = (day) => {
    if (!day || !selectedDate) return false;
    try {
      const dateObj = new Date(selectedDate + "T00:00:00");
      return (
        day === dateObj.getDate() &&
        currentMonth.getMonth() === dateObj.getMonth() &&
        currentMonth.getFullYear() === dateObj.getFullYear()
      );
    } catch {
      return false;
    }
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (day) => {
    if (!day) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck < today;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg ${compact ? "p-4" : "p-6"}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-green-100 rounded-lg transition-colors"
          type="button"
        >
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h2 className="text-lg font-bold text-green-600">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-green-100 rounded-lg transition-colors"
          type="button"
        >
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className={`grid grid-cols-7 gap-1 mb-3 ${compact ? "text-xs" : "text-sm"}`}>
        {dayNames.map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className={`grid grid-cols-7 gap-1`}>
        {days.map((day, index) => {
          const isPast = isPastDate(day);
          const isSelected = isDateSelected(day);
          const todayDate = isToday(day);

          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          return (
            <button
              key={day}
              type="button"
              onClick={() => !isPast && handleSelectDate(day)}
              disabled={isPast}
              className={`
                aspect-square flex items-center justify-center rounded-lg font-semibold transition-all cursor-pointer
                ${todayDate
                  ? "bg-green-500 text-white"
                  : isSelected
                  ? "bg-green-600 text-white ring-2 ring-green-400"
                  : isPast
                  ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                  : "hover:bg-green-100 text-gray-800"
                }
                ${compact ? "text-xs" : "text-sm"}
              `}
              title={isPast ? "Fecha pasada" : ""}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Info */}
      {!compact && (
        <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p>• <span className="text-green-500 font-semibold">Verde fuerte</span> = Hoy</p>
          <p>• <span className="text-green-600 font-semibold">Verde oscuro</span> = Seleccionado</p>
          <p>• <span className="text-gray-300 font-semibold">Gris</span> = Fechas pasadas</p>
        </div>
      )}
    </div>
  );
}

export default Calendar;
