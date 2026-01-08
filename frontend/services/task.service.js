import api from './api';

export const taskService = {
  getTaskExecutionDetails: async (instanceId) => {
    const response = await api.get(`/tasks/${instanceId}`);
    return response.data;
  },

  submitTask: async (slotId, instanceId, data) => {
    const response = await api.post(`/submissions`, {
      slot_id: slotId,
      task_instance_id: instanceId,
      payload: data
    });
    return response.data;
  },

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
