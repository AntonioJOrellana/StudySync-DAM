import axios from 'axios';

const API_URL = 'http://localhost:8080/api/mazos';

export const mazoService = {
  // Asegúrate de que este nombre sea exacto
  listarPorUsuario: (userId) => axios.get(`${API_URL}/usuario/${userId}`),
  
  listarPorAsignatura: (asigId) => axios.get(`${API_URL}/asignatura/${asigId}`),
  
  crear: (mazo) => axios.post(API_URL, mazo)
};