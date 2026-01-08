import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    return true;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/current_user');
    return response.data;
  },
};
