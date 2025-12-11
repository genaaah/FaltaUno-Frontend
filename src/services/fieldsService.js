import api from "./api";

export const fieldsService = {
  async getAllFields() {
    try {
      console.log("🔍 FieldsService: Obteniendo canchas...");
      const response = await api.get("/fields");
      console.log("✅ Canchas obtenidas:", response.data?.length || 0);
      return response.data || [];
    } catch (error) {
      console.error("❌ Error al obtener canchas:", error.message);
      return [];
    }
  },

  async getFieldById(id) {
    try {
      console.log(`🔍 FieldsService: Obteniendo cancha ID ${id}...`);
      const response = await api.get(`/fields/${id}`);
      console.log("✅ Cancha obtenida:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener cancha:", error.message);
      throw new Error(
        error.response?.data?.message || "Error al obtener cancha"
      );
    }
  },

  async createField(fieldName) {
    try {
      console.log("🎯 FieldsService: Creando cancha...", fieldName);
      const response = await api.post("/fields", { nombre: fieldName });
      console.log("✅ Cancha creada:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear cancha:", error.message);
      throw new Error(
        error.response?.data?.message || "Error al crear cancha"
      );
    }
  },

  async updateField(id, fieldName) {
    try {
      console.log(`🔄 FieldsService: Actualizando cancha ID ${id}...`, fieldName);
      const response = await api.put(`/fields/${id}`, { nombre: fieldName });
      console.log("✅ Cancha actualizada:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar cancha:", error.message);
      throw new Error(
        error.response?.data?.message || "Error al actualizar cancha"
      );
    }
  },

  async deleteField(id) {
    try {
      console.log(`🗑️ FieldsService: Eliminando cancha ID ${id}...`);
      const response = await api.delete(`/fields/${id}`);
      console.log("✅ Cancha eliminada:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar cancha:", error.message);
      throw new Error(
        error.response?.data?.message || "Error al eliminar cancha"
      );
    }
  },

  formatForSelect(fields) {
    return fields.map(field => ({
      value: field.id,
      label: field.nombre
    }));
  }
};