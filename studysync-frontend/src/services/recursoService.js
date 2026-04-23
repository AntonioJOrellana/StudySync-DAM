const API_URL = "http://localhost:8080/api/recursos";

export const recursoService = {
  // Obtener la biblioteca de una materia
  async getRecursosPorAsignatura(asignaturaId) {
    const response = await fetch(`${API_URL}/asignatura/${asignaturaId}`);
    if (!response.ok) throw new Error("No se pudieron cargar los recursos");
    return await response.json();
  },

  // Guardar un nuevo recurso (Link o metadata de archivo)
  async guardar(recurso) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recurso),
    });
    return await response.json();
  },

  // Borrar recurso
  async eliminar(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  }
};
