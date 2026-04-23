const API_URL = "http://localhost:8080/api/tareas";

export const tareaService = {
  // Obtener tareas pendientes de una materia
  async getTareasPorAsignatura(asignaturaId) {
    const response = await fetch(`${API_URL}/asignatura/${asignaturaId}`);
    if (!response.ok) throw new Error("Error al cargar tareas");
    return await response.json();
  },

  // El famoso Patch para los Checkboxes
  async cambiarEstado(id, nuevoEstado) {
    const response = await fetch(`${API_URL}/${id}/estado?nuevoEstado=${nuevoEstado}`, {
      method: 'PATCH'
    });
    return await response.json();
  },

  // Crear una nueva tarea desde la interfaz
  async crear(tarea) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarea),
    });
    return await response.json();
  }
};