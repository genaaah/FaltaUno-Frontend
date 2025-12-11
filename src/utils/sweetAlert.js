import Swal from "sweetalert2";

export const sweetAlert = {
  basic: (title, text, icon = "info") => {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: "OK",
      confirmButtonColor: "#16a34a",
      background: "#f0fdf4",
      color: "#1f2937",
    });
  },

  confirm: (title, text, confirmText = "Sí", cancelText = "No") => {
    return Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
      background: "#f0fdf4",
      color: "#1f2937",
      reverseButtons: true,
    });
  },

  confirmCritical: (
    title,
    text,
    confirmText = "Eliminar",
    cancelText = "Cancelar"
  ) => {
    return Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      background: "#fef2f2",
      color: "#1f2937",
      reverseButtons: true,
      customClass: {
        confirmButton: "swal2-confirm-critical",
      },
    });
  },

  confirmWithInput: (
    title,
    text,
    inputPlaceholder,
    confirmText = "Confirmar",
    cancelText = "Cancelar"
  ) => {
    return Swal.fire({
      title,
      text,
      input: "text",
      inputPlaceholder,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      background: "#fef2f2",
      color: "#1f2937",
      showLoaderOnConfirm: true,
      preConfirm: (inputValue) => {
        if (!inputValue) {
          Swal.showValidationMessage("Debes escribir el texto solicitado");
        }
        return inputValue;
      },
    });
  },

  success: (title, text = "") => {
    return Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#16a34a",
      background: "#f0fdf4",
      color: "#1f2937",
    });
  },

  error: (title, text = "") => {
    return Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#dc2626",
      background: "#f0fdf4",
      color: "#1f2937",
    });
  },

  warning: (title, text = "") => {
    return Swal.fire({
      title,
      text,
      icon: "warning",
      confirmButtonText: "OK",
      confirmButtonColor: "#f59e0b",
      background: "#f0fdf4",
      color: "#1f2937",
    });
  },

  loading: (title = "Procesando...") => {
    Swal.fire({
      title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
      background: "#f0fdf4",
      color: "#1f2937",
    });
  },

  close: () => {
    Swal.close();
  },
};
