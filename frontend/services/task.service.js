import api from './api';

export const taskService = {
  getTasks: async () => {
    // const response = await api.get('/tasks');
    // return response.data;
    return [];
  },

  createTask: async (task) => {
    // const response = await api.post('/tasks', task);
    // return response.data;
    return { id: Date.now(), ...task };
  },

  updateTask: async (id, updates) => {
    // const response = await api.put(`/tasks/${id}`, updates);
    // return response.data;
    return { success: true };
  },

  deleteTask: async (id) => {
    // await api.delete(`/tasks/${id}`);
    return { success: true };
  },
};
