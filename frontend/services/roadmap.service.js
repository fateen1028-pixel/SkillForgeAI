import api from './api';

export const roadmapService = {
  getRoadmap: async () => {
    // const response = await api.get('/roadmap');
    // return response.data;
    return [];
  },

  updateProgress: async (phaseId, itemId, completed) => {
    // const response = await api.put(`/roadmap/${phaseId}/items/${itemId}`, { completed });
    // return response.data;
    return { success: true };
  },
};
