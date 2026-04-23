const API_URL = "http://localhost:8080/api/usuarios";

export const authService = {
  // Login: Si es exitoso, guardamos el usuario en localStorage
  async login(email, password) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    
    const user = await response.json();
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  // Registro de nuevo usuario
  async registrar(userData) {
    const response = await fetch(`${API_URL}/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Error en el registro");
    return await response.json();
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
};