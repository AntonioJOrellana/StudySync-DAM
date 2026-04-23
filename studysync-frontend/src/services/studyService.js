import api from './api';

export const asignaturaService = {
  listarPorUsuario: (id) => api.get(`/asignaturas/usuario/${id}`),
};

export const mazoService = {
  listarPorAsignatura: (id) => api.get(`/mazos/asignatura/${id}`),
};

export const flashcardService = {
  obtenerPendientes: (mazoId) => api.get(`/flashcards/mazo/${mazoId}/pendientes`),
  registrarRepaso: (id, acierto) => api.post(`/flashcards/${id}/repaso?acierto=${acierto}`),
};

export const tareaService = {
  listarPorAsignatura: (id) => api.get(`/tareas/asignatura/${id}`),
  cambiarEstado: (id, estado) => api.patch(`/tareas/${id}/estado?nuevoEstado=${estado}`),
};

export const sesionService = {
  iniciar: (datos) => api.post('/sesiones/iniciar', datos),
  finalizar: (id, duracion) => api.put(`/sesiones/finalizar/${id}?duracion=${duracion}`),
};