import api from './api';

export const asignaturaService = {
  listarTodos: () => api.get('/asignaturas'),
  listarPorUsuario: (usuarioId) => api.get(`/asignaturas/usuario/${usuarioId}`),
  obtenerPorId: (id) => api.get(`/asignaturas/${id}`)
};