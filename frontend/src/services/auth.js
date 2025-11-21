import api from './api';

export const authService = {
  async login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post('/integrations/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = response.data;
    localStorage.setItem('eyesonasset_token', access_token);
    
    // Armazenar dados do usuário
    const user = { username };
    localStorage.setItem('eyesonasset_user', JSON.stringify(user));
    
    return user;
  },

  async register(username, password) {
    const response = await api.post('/integrations/cadastro', {
      username,
      password,
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('eyesonasset_token');
    localStorage.removeItem('eyesonasset_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('eyesonasset_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('eyesonasset_token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};