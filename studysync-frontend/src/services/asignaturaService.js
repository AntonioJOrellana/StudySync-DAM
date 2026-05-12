import api from './api';
import axios from 'axios';

const API_BASE = "http://localhost:8080/api/asignaturas";

export const asignaturaService = {
  listarTodos: () => api.get('/asignaturas'),
  listarPorUsuario: (usuarioId) => api.get(`/asignaturas/usuario/${usuarioId}`),
  obtenerPorId: (id) => api.get(`/asignaturas/${id}`),
  crear: (data) => api.post('/asignaturas', data),
  
  // NUEVO: Registrar sesión de estudio
  // El backend debe esperar un objeto con 'duracion' y el 'id' de la asignatura
  registrarSesion: (asignaturaId, duracionMinutos) => 
    api.post(`/asignaturas/${asignaturaId}/sesiones`, { duracion: duracionMinutos })
};