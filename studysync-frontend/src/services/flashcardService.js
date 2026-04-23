const API_BASE_URL = "http://localhost:8080/api/flashcards";

export const flashcardService = {
  // Obtener tarjetas que toca repasar hoy
  async getPendientes(mazoId) {
    const response = await fetch(`${API_BASE_URL}/mazo/${mazoId}/pendientes`);
    if (!response.ok) throw new Error("Error al cargar pendientes");
    return await response.json();
  },

  // Registrar si el usuario acertó o falló (Algoritmo SM-2)
  async registrarRepaso(id, acierto) {
    const response = await fetch(`${API_BASE_URL}/${id}/repaso?acierto=${acierto}`, {
      method: 'POST'
    });
    return await response.json();
  },

  // Magia: Generar flashcards con IA desde un PDF
  async generarConIA(recursoId) {
    const response = await fetch(`${API_BASE_URL}/ia/recurso/${recursoId}`, {
      method: 'POST'
    });
    return await response.json();
  }
};