const API_URL = "http://localhost:8080/api/sesiones";

export const sesionService = {
  // Iniciar el contador en el servidor
  async iniciar(asignaturaId, usuarioId) {
    const response = await fetch(`${API_URL}/iniciar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        asignatura: { id: asignaturaId },
        usuario: { id: usuarioId },
        fechaInicio: new Date().toISOString()
      }),
    });
    return await response.json();
  },

  // Guardar el tiempo final
  async finalizar(sesionId, duracionMinutos) {
    const response = await fetch(`${API_URL}/finalizar/${sesionId}?duracion=${duracionMinutos}`, {
      method: 'PUT'
    });
    return await response.json();
  }
};