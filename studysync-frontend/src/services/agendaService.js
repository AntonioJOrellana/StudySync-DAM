const API_BASE_URL = "http://localhost:8080/api/agenda"; // Ajusta el puerto si es necesario

export const agendaService = {
  // Obtener eventos del usuario (usaremos el ID 1 por defecto para el ejemplo)
  async getEventosPorUsuario(usuarioId) {
    const response = await fetch(`${API_BASE_URL}/usuario/${usuarioId}`);
    if (!response.ok) throw new Error("Error al obtener la agenda");
    return await response.json();
  },

  // Crear un evento
  async crearEvento(evento) {
    const response = await fetch(`${API_BASE_URL}/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evento),
    });
    return await response.json();
  },

  // Eliminar un evento
  async eliminarEvento(id) {
    await fetch(`${API_BASE_URL}/eliminar/${id}`, { method: 'DELETE' });
  },
  async actualizarEvento(id, evento) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evento),
    });
    if (!response.ok) throw new Error("Error al actualizar el evento");
    return await response.json();
  }
};