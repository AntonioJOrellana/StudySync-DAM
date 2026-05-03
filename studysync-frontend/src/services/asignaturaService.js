import api from './api';
import axios from 'axios';
const API_URL = "http://localhost:8080/api/asignaturas";

export const asignaturaService = {
  listarTodos: () => api.get('/asignaturas'),
  listarPorUsuario: (usuarioId) => api.get(`/asignaturas/usuario/${usuarioId}`),
  obtenerPorId: (id) => api.get(`/asignaturas/${id}`),
  crear: (data) => axios.post(API_URL, data),
  eliminar: (id) => axios.delete(`${API_URL}/${id}`)
};