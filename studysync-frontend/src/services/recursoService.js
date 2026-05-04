import axios from 'axios';

const API_URL = "http://localhost:8080/api/recursos";

export const recursoService = {
  
  /**
   * Obtiene la lista de recursos de una materia usando el ID correcto.
   */
  async getRecursosPorAsignatura(asignaturaId) {
    try {
      const response = await axios.get(`${API_URL}/asignatura/${asignaturaId}`);
      return response.data;
    } catch (error) {
      // Si no hay recursos (404), devolvemos un array vacío para no romper el mapa
      if (error.response && error.response.status === 404) return [];
      throw new Error("No se pudieron cargar los recursos.");
    }
  },

  /**
   * Sube el archivo y los datos. 
   * Axios configura automáticamente el 'Content-Type' como 'multipart/form-data'.
   */
  async subir(formData) {
    try {
      const response = await axios.post(`${API_URL}/subir`, formData);
      return response.data;
    } catch (error) {
      // Capturamos el mensaje de error que viene del backend (el Error 500)
      const message = error.response?.data?.message || "Error al subir el recurso al servidor.";
      throw new Error(message);
    }
  },

  async eliminar(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      throw new Error("No se pudo eliminar el recurso.");
    }
  }
};