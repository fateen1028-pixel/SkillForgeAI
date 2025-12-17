import api from './api';

export const authService = {
  login: async (email, password) => {
    // const response = await api.post('/auth/login', { email, password });
    // return response.data;
    return { user: { name: 'Demo User' }, token: 'demo-token' };
  },

  register: async (name, email, password) => {
    // const response = await api.post('/auth/register', { name, email, password });
    // return response.data;
    return { user: { name }, token: 'demo-token' };
  },

  logout: async () => {
    // await api.post('/auth/logout');
    return true;
  },

  getCurrentUser: async () => {
    // const response = await api.get('/auth/me');
    // return response.data;
    return { name: 'Demo User', email: 'demo@example.com' };
  },
};
