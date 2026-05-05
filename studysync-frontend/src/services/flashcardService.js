const API_BASE_URL = "http://localhost:8080/api/flashcards";

export const flashcardService = {
  // Obtener tarjetas pendientes
  async getPendientes(mazoId) {
    const response = await fetch(`${API_BASE_URL}/mazo/${mazoId}/pendientes`);
    if (!response.ok) throw new Error("Error al cargar pendientes");
    return await response.json();
  },

  // Algoritmo SM-2
  async registrarRepaso(id, acierto) {
    const response = await fetch(`${API_BASE_URL}/${id}/repaso?acierto=${acierto}`, {
      method: 'POST'
    });
    return await response.json();
  },

  // --- GENERAR CON IA: URL ACTUALIZADA ---
  async generarConIA(mazoId, recursoId) {
    // Hemos añadido "/mazo/${mazoId}" al final para que coincida con el @PostMapping del Controller
    const response = await fetch(`${API_BASE_URL}/ia/recurso/${recursoId}/mazo/${mazoId}`, {
      method: 'POST'
    });
    
    if (!response.ok) throw new Error("Error en el servidor de IA");
    return await response.json();
  }
};